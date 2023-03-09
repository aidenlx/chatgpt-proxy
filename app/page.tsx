import Home from "@/components/Home";
import preset from "@/preset.json";

export default function RootPage() {
  return <Home roles={Object.keys(preset)} />;
}
