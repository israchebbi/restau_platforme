import { Redirect } from "expo-router";
import { useAuthStore } from "../store/auth";

export default function Index() {
  const isLoggedIn = useAuthStore((state) => state.token !== null);

  return <Redirect href={isLoggedIn ? "/home" : "/login"} />;
}