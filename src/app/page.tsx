import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Home</h1>
        <p className="text-muted-foreground">
          Welcome to your dashboard overview.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>User count for this month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,234</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Monthly revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$12,345</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>Current active users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">423</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent dashboard activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-lg border p-3"
                >
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-medium">Activity {i + 1}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>System performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["CPU", "Memory", "Disk", "Network", "Database"].map(
                (metric) => (
                  <div
                    key={metric}
                    className="flex items-center justify-between"
                  >
                    <p className="text-sm font-medium">{metric}</p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{
                            width: `${Math.floor(Math.random() * 100)}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {Math.floor(Math.random() * 100)}%
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
