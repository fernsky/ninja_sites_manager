import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import { Signup } from "./signup";

export const metadata = {
  title: "Signup",
  description: "Signup Page",
};

export default async function SignupPage() {
  const { user } = await validateRequest();

  if (user) redirect(Paths.Dashboard);

  return <Signup />;
}
// import { redirect } from "next/navigation";
// import { Paths } from "@/lib/constants";

// export const metadata = {
//   title: "Signup Disabled",
//   description: "Signup is no longer available",
// };

// export default async function SignupPage() {
//   // Redirect all users to login page
//   // redirect(Paths.Login);

//   // This code will never be reached due to redirect
//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="text-center">
//         <h1 className="text-2xl font-bold mb-4">Signup Not Available</h1>
//         <p>We are no longer accepting new account registrations.</p>
//       </div>
//     </div>
//   );
// }
