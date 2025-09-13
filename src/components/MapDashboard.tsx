import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { UnifiedMap } from "./UnifiedMap";

export function MapDashboard() {

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-xl">
          <MapPin className="h-6 w-6 text-blue-600" />
          <span>Interactive Road Quality Map</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <UnifiedMap />
      </CardContent>
    </Card>
  );
}
