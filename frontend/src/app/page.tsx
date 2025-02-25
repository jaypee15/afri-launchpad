import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Temporary mock data for startups
const startups = [
  {
    id: 1,
    name: "FarmTech Africa",
    pitch: "Empowering farmers with AI-driven crop management solutions",
    sector: "AgriTech",
    waitlistCount: 245,
  },
  {
    id: 2,
    name: "PayEase",
    pitch: "Seamless cross-border payments for African businesses",
    sector: "FinTech",
    waitlistCount: 532,
  },
  {
    id: 3,
    name: "HealthConnect",
    pitch: "Telemedicine platform for rural communities",
    sector: "HealthTech",
    waitlistCount: 178,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="max-w-3xl w-full text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
          Discover Africa's Next Big Startups
        </h1>
        <p className="text-lg text-muted-foreground">
          Be the first to know about innovative African startups before they launch.
          Follow their journey and get early access to their products.
        </p>
      </div>

      <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {startups.map((startup) => (
          <Card key={startup.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{startup.name}</CardTitle>
              <CardDescription>{startup.sector}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p>{startup.pitch}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                {startup.waitlistCount} people waiting
              </p>
              <Button>Follow</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
