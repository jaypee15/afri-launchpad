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
    <div className="container py-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          Discover Africa's Next Big Startups
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Be the first to know about innovative African startups before they launch.
          Follow their journey and get early access to their products.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {startups.map((startup) => (
          <Card key={startup.id}>
            <CardHeader>
              <CardTitle>{startup.name}</CardTitle>
              <CardDescription>{startup.sector}</CardDescription>
            </CardHeader>
            <CardContent>
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
