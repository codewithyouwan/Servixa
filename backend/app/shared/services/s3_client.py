"""Thin wrapper around S3 for presigned browser uploads.

Pattern: the backend never receives the image bytes. It hands the
browser a short-lived presigned PUT URL for a specific object key; the
browser uploads directly to S3; only the resulting object URL is saved
on the post. AWS credentials never reach the frontend, and large images
never round-trip through the API server. See AWS's own guidance on this
pattern: https://aws.amazon.com/blogs/compute/patterns-for-building-an-api-to-upload-files-to-amazon-s3/
"""

import uuid

import boto3

from app.shared.config import settings

_client = boto3.client("s3", region_name=settings.aws_region)

_PRESIGN_EXPIRY_SECONDS = 300  # 5 minutes -- long enough for a browser upload to start.

_ALLOWED_CONTENT_TYPES = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
}


class UnsupportedImageType(ValueError):
    pass


def presign_blog_image_upload(content_type: str) -> dict[str, str]:
    """Returns {"uploadUrl": ..., "objectUrl": ...} for a new, unique
    object key under blog/. The caller PUTs the raw file bytes to
    uploadUrl with the same Content-Type; objectUrl is the public URL
    to save on the post once the upload succeeds.
    """
    extension = _ALLOWED_CONTENT_TYPES.get(content_type)
    if extension is None:
        raise UnsupportedImageType(
            f"Unsupported image type '{content_type}'. Allowed: "
            f"{', '.join(_ALLOWED_CONTENT_TYPES)}"
        )

    key = f"blog/{uuid.uuid4()}.{extension}"

    upload_url = _client.generate_presigned_url(
        ClientMethod="put_object",
        Params={
            "Bucket": settings.blog_media_bucket,
            "Key": key,
            "ContentType": content_type,
        },
        ExpiresIn=_PRESIGN_EXPIRY_SECONDS,
    )
    object_url = (
        f"https://{settings.blog_media_bucket}.s3.{settings.aws_region}"
        f".amazonaws.com/{key}"
    )
    return {"uploadUrl": upload_url, "objectUrl": object_url}
