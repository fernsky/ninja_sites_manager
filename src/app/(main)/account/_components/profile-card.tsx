import { User, AtSign, Building2, Phone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserAvatarUpload } from "./user-avatar-upload";

const roleColors = {
  admin: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  superadmin: "bg-red-100 text-red-800 hover:bg-red-200",
  enumerator: "bg-blue-100 text-blue-800 hover:bg-blue-200",
};

export function ProfileCard({ user }: { user: any }) {
  if (!user) return null;
  return (
    <Card className="border-primary/10 shadow-md">
      <CardHeader className="border-b bg-muted/50 pb-8">
        <div className="flex items-center gap-6">
          <UserAvatarUpload userId={user.id} currentAvatar={user.avatar} />
          <div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <CardDescription className="mt-1">Account Profile</CardDescription>
          </div>
        </div>
        <div className="mt-4">
          <Badge
            className={`${
              roleColors[user.role as keyof typeof roleColors]
            } px-3 py-1 text-xs font-medium`}
          >
            {(user.role ?? "user").toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <AtSign className="h-4 w-4 text-blue-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Username
              </p>
              <p className="font-medium">{user.userName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2">
              <Building2 className="h-4 w-4 text-green-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Ward Assignment
              </p>
              <p className="font-medium">Ward {user.wardNumber}</p>
            </div>
          </div>

          {user.phoneNumber && (
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-100 p-2">
                <Phone className="h-4 w-4 text-orange-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Phone
                </p>
                <p className="font-medium">{user.phoneNumber}</p>
              </div>
            </div>
          )}

          {user.email && (
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-100 p-2">
                <Mail className="h-4 w-4 text-purple-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
