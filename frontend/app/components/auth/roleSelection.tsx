"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SquareUserRound, HardHat, Building2, ArrowRight, Check } from "lucide-react";

export type UserRole = "company" | "contractor" | "homeowner";

interface RoleSelectionCardProps {
  onSelectRole: (role: UserRole) => void;
  onBack?: () => void;
}

export function RoleSelectionCard({ onSelectRole, onBack }: RoleSelectionCardProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = [
    {
      id: "company" as UserRole,
      title: "Company",
      description: "Manage teams, projects, and multiple business operations.",
      icon: Building2,
    },
    {
      id: "contractor" as UserRole,
      title: "Contractor",
      description: "Find jobs, submit bids, and provide expert services.",
      icon: HardHat,
    },
    {
      id: "homeowner" as UserRole,
      title: "Homeowner",
      description: "Post home improvement projects and hire top professionals.",
      icon: SquareUserRound,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    setIsSubmitting(true);
    // Simulate API delay for a premium feel
    setTimeout(() => {
      setIsSubmitting(false);
      onSelectRole(selectedRole);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md border-border bg-card text-card-foreground shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
      <CardHeader className="space-y-1.5 pb-4">
        <CardTitle className="text-xl font-semibold text-foreground">
          What type of user are you?
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Choose the role that best describes your needs on BestBuild.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;

              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`relative w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${isSelected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors ${isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-muted-foreground border-border"
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold text-foreground leading-none">
                      {role.title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-normal">
                      {role.description}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground animate-in zoom-in-50 duration-150">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex gap-3">
            {onBack && (
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={isSubmitting}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              type="submit"
              disabled={!selectedRole || isSubmitting}
              className="flex-1 group bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {isSubmitting ? (
                "Please wait…"
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
