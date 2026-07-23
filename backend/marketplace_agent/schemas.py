# marketplace_agent/state.py
import operator
from typing import TypedDict, Annotated, List, Dict, Any, Optional, Literal

class MarketplaceState(TypedDict):
    # =========================================================================
    # 1. HISTORY (Additive reducers)
    # =========================================================================
    user_messages: Annotated[List[str], operator.add]
    messages: Annotated[List[Dict[str, str]], operator.add]

    # =========================================================================
    # 2. SECURITY & MODERATION
    # =========================================================================
    security_moderation: Optional[Literal["violates", "outofscope", "injection", "passed"]]
    fatal_message: Optional[bool]
    terminated: Optional[bool]
    termination_reason: Optional[Literal["injection", "fatal_threat", "security_strikes", "offtopic_strikes"]]
    soft_warnings: int
    security_strikes: int

    # =========================================================================
    # 3. ROUTING & INTENT
    # =========================================================================
    user_action: Optional[Literal["request-details", "qa", "pivoting"]]
    qa_grounded: Optional[bool]
    active_intake: bool
    resume_target: Optional[str] 
    # Subgraph exit signals (used by root to route after subgraph completes)
    routing_qa_exit: Optional[Literal["to_intake", "idle"]] 
    intake_exit: Optional[Literal["complete", "error"]]
    business_exit: Optional[Literal["done", "error"]]

    # =========================================================================
    # 4. LOCATION & CATEGORY
    # =========================================================================
    pincode: Optional[str]
    pincode_valid: bool
    category: Optional[str]
    category_status: Optional[Literal["resolved", "ambiguous", "unsupported"]]
    supported_categories: List[str]

    # =========================================================================
    # 5. DYNAMIC INTAKE / SLOT FILLING
    # =========================================================================
    target_schema: Dict[str, Any]
    collected_details: Dict[str, Any]
    missing_fields: List[str]
    is_data_complete: bool
    intake_attempts: int
    zip_attempts: int

    # =========================================================================
    # 6. BUSINESS LOGIC & TOOLS
    # =========================================================================
    matched_contractors: List[Dict[str, Any]]
    price_estimate: Optional[Dict[str, Any]]
    work_order_id: Optional[str]
    final_response: Optional[str]
    idempotency_key: Optional[str]
    execution_status: Optional[Literal["success", "no_service", "no_match", "tool_error"]]
    search_broadened: bool

# marketplace_agent/config.py
from dataclasses import dataclass
from typing import Optional

@dataclass
class MarketplaceConfig:
    thread_id: str
    user_id: str
    pincode: Optional[str] = None  # Pre-filled from UI if available
    
    # Strike thresholds
    max_soft_warnings: int = 3
    max_security_strikes: int = 3
    
    # Loop guards
    max_intake_attempts: int = 3
    max_zip_attempts: int = 3
    
    environment: str = "production"