import Observatory from "./observatory";
import { chatGPTSignInPath, chatGPTSignOutPath } from "./chatgpt-auth";
export default function Frame({ page = "overview" }: { page?: string }) {
  return (
    <Observatory
      page={page}
      signInHref={chatGPTSignInPath("/?alerts=1")}
      signOutHref={chatGPTSignOutPath("/")}
    />
  );
}
