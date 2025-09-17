import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-5 h-5 bg-white rounded-sm transform rotate-45 opacity-90"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Road Quality Monitoring</h1>
              <p className="text-sm text-gray-600">Real-time road condition monitoring system</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="icon" className="border-gray-200 text-gray-600 hover:bg-gray-50">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
