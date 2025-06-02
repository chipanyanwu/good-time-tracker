"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
  PolarGrid,
  PolarRadiusAxis,
  Label,
} from "recharts"

// Sample data for Energy and Engagement Over Time (last 30 days)
const energyEngagementData = [
  { date: "2025-05-02", energy: 75, engagement: 85 },
  { date: "2025-05-03", energy: 60, engagement: 70 },
  { date: "2025-05-04", energy: 80, engagement: 90 },
  { date: "2025-05-05", energy: 45, engagement: 60 },
  { date: "2025-05-06", energy: 70, engagement: 80 },
  { date: "2025-05-07", energy: 85, engagement: 95 },
  { date: "2025-05-08", energy: 90, engagement: 85 },
  { date: "2025-05-09", energy: 55, engagement: 65 },
  { date: "2025-05-10", energy: 75, engagement: 80 },
  { date: "2025-05-11", energy: 65, engagement: 75 },
  { date: "2025-05-12", energy: 80, engagement: 90 },
  { date: "2025-05-13", energy: 70, engagement: 85 },
  { date: "2025-05-14", energy: 85, engagement: 80 },
  { date: "2025-05-15", energy: 60, engagement: 70 },
  { date: "2025-05-16", energy: 75, engagement: 85 },
  { date: "2025-05-17", energy: 80, engagement: 90 },
  { date: "2025-05-18", energy: 70, engagement: 75 },
  { date: "2025-05-19", energy: 85, engagement: 95 },
  { date: "2025-05-20", energy: 65, engagement: 70 },
  { date: "2025-05-21", energy: 75, engagement: 80 },
  { date: "2025-05-22", energy: 80, engagement: 85 },
  { date: "2025-05-23", energy: 70, engagement: 75 },
  { date: "2025-05-24", energy: 85, engagement: 90 },
  { date: "2025-05-25", energy: 60, engagement: 65 },
  { date: "2025-05-26", energy: 75, engagement: 80 },
  { date: "2025-05-27", energy: 80, engagement: 85 },
  { date: "2025-05-28", energy: 70, engagement: 75 },
  { date: "2025-05-29", energy: 85, engagement: 90 },
  { date: "2025-05-30", energy: 75, engagement: 80 },
  { date: "2025-06-01", energy: 80, engagement: 85 },
]

// Sample data for Weekly Engagement Trend
const weeklyEngagementData = [
  { week: "Week 1", engagement: 78 },
  { week: "Week 2", engagement: 82 },
  { week: "Week 3", engagement: 75 },
  { week: "Week 4", engagement: 85 },
  { week: "Week 5", engagement: 80 },
  { week: "Week 6", engagement: 88 },
  { week: "Week 7", engagement: 83 },
  { week: "Week 8", engagement: 90 },
]

// Sample data for Weekly Energy Trend
const weeklyEnergyData = [
  { week: "Week 1", energy: 72 },
  { week: "Week 2", energy: 78 },
  { week: "Week 3", energy: 69 },
  { week: "Week 4", energy: 81 },
  { week: "Week 5", energy: 76 },
  { week: "Week 6", energy: 84 },
  { week: "Week 7", energy: 79 },
  { week: "Week 8", energy: 86 },
]

// Sample data for Current Week's Radial Charts
const currentWeekEnergy = [{ name: "Energy", value: 76, fill: "#3b82f6" }]
const currentWeekEngagement = [
  { name: "Engagement", value: 84, fill: "#10b981" },
]

const areaChartConfig = {
  energy: {
    label: "Energy",
    color: "#3b82f6",
  },
  engagement: {
    label: "Engagement",
    color: "#10b981",
  },
} satisfies ChartConfig

const lineChartConfig = {
  engagement: {
    label: "Engagement",
    color: "#3b82f6",
  },
} satisfies ChartConfig

const energyLineChartConfig = {
  energy: {
    label: "Energy",
    color: "#10b981",
  },
} satisfies ChartConfig

const radialChartConfig = {
  energy: {
    label: "Energy",
    color: "#3b82f6",
  },
  engagement: {
    label: "Engagement",
    color: "#10b981",
  },
} satisfies ChartConfig

export default function InsightsPage() {
  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
        <p className="text-muted-foreground">
          Analyze your energy and engagement patterns over time
        </p>
      </div>

      {/* Current Week's Average Energy & Engagement - Radial Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="pb-0 gap-0">
          <CardHeader className="items-center pb-0 text-center">
            <CardTitle className="text-xl">Current Week's Energy</CardTitle>
            <CardDescription>Average energy level this week</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={radialChartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <RadialBarChart
                data={currentWeekEnergy}
                startAngle={0}
                endAngle={250}
                innerRadius={80}
                outerRadius={110}
              >
                <PolarGrid
                  gridType="circle"
                  radialLines={false}
                  stroke="none"
                  className="first:fill-muted last:fill-background"
                  polarRadius={[86, 74]}
                />
                <RadialBar dataKey="value" background cornerRadius={10} />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-4xl font-bold"
                            >
                              {currentWeekEnergy[0].value}%
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Energy
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="pb-0 gap-0">
          <CardHeader className="items-center pb-0 text-center">
            <CardTitle className="text-xl">Current Week's Engagement</CardTitle>
            <CardDescription>
              Average engagement level this week
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={radialChartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <RadialBarChart
                data={currentWeekEngagement}
                startAngle={0}
                endAngle={250}
                innerRadius={80}
                outerRadius={110}
              >
                <PolarGrid
                  gridType="circle"
                  radialLines={false}
                  stroke="none"
                  className="first:fill-muted last:fill-background"
                  polarRadius={[86, 74]}
                />
                <RadialBar dataKey="value" background cornerRadius={10} />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-4xl font-bold"
                            >
                              {currentWeekEngagement[0].value}%
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Engagement
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6 w-full">
        {/* Energy and Engagement Over Time - Area Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Energy and Engagement Over Time</CardTitle>
            <CardDescription>
              Daily energy and engagement levels for the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={areaChartConfig}
              className="aspect-auto h-[300px] w-full"
            >
              <AreaChart accessibilityLayer data={energyEngagementData}>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={30}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                  labelFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
                <Area
                  dataKey="engagement"
                  type="natural"
                  fill="var(--color-engagement)"
                  fillOpacity={0.4}
                  stroke="var(--color-engagement)"
                  stackId="a"
                />
                <Area
                  dataKey="energy"
                  type="natural"
                  fill="var(--color-energy)"
                  fillOpacity={0.4}
                  stroke="var(--color-energy)"
                  stackId="a"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Weekly Engagement Trend - Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Engagement Trend</CardTitle>
            <CardDescription>
              Average engagement score per week over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={lineChartConfig}
              className="aspect-auto h-[300px] w-full"
            >
              <LineChart accessibilityLayer data={weeklyEngagementData}>
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={30}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey="engagement"
                  type="natural"
                  stroke="var(--color-engagement)"
                  strokeWidth={2}
                  dot={{
                    fill: "var(--color-engagement)",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Weekly Energy Trend - Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Energy Trend</CardTitle>
            <CardDescription>
              Average energy score per week over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={energyLineChartConfig}
              className="aspect-auto h-[300px] w-full"
            >
              <LineChart accessibilityLayer data={weeklyEnergyData}>
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={30}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey="energy"
                  type="natural"
                  stroke="var(--color-energy)"
                  strokeWidth={2}
                  dot={{
                    fill: "var(--color-energy)",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
