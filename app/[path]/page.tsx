import Home from "@/components/Home";
import preset from "@/preset.json";

export default function RootPage({ params }: { params: { path: string } }) {
  return <Home path={params.path} roles={Object.keys(preset)} />;
}
