import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, RefreshCw, FileDown, Bell } from "lucide-react";

interface HeaderProps {
  alertCount: number;
}

export function Header({ alertCount }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-600 rounded transform rotate-45"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Road Quality Monitoring Dashboard</h1>
              <p className="text-blue-100">Real-time road condition monitoring for Mohali & Chandigarh</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Bell className="h-4 w-4" />
              </Button>
              {alertCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 px-1.5 min-w-[1.25rem] h-5 flex items-center justify-center"
                >
                  {alertCount}
                </Badge>
              )}
            </div>
            
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <FileDown className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
