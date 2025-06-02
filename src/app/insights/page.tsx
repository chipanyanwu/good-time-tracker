"use client"

import { useState, useEffect } from "react"
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
import { Spinner } from "@/components/ui/spinner"
import { auth } from "@/lib/firebase/firebaseConfig"
import { useRouter } from "next/navigation"
import { useAuthState } from "react-firebase-hooks/auth"
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

// Import aggregator functions
import {
  getEnergyEngagementOverTime,
  getWeeklyEngagementTrend,
  getWeeklyEnergyTrend,
  getCurrentWeekAverages,
} from "@/lib/insightsAggregator"

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
  const [user, loading] = useAuthState(auth)
  const router = useRouter()

  const [energyEngagementData, setEnergyEngagementData] = useState<
    Array<{ date: string; energy: number; engagement: number }>
  >([])
  const [weeklyEngagementData, setWeeklyEngagementData] = useState<
    Array<{ week: string; engagement: number }>
  >([])
  const [weeklyEnergyData, setWeeklyEnergyData] = useState<
    Array<{ week: string; energy: number }>
  >([])
  const [currentWeekEnergy, setCurrentWeekEnergy] = useState<
    Array<{ name: string; value: number; displayValue: number; fill: string }>
  >([])
  const [currentWeekEngagement, setCurrentWeekEngagement] = useState<
    Array<{ name: string; value: number; fill: string }>
  >([])

  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  useEffect(() => {
    if (!user) return

    const loadInsights = async () => {
      setFetching(true)
      const [eedata, wengdata, wenedata, currAverages] = await Promise.all([
        getEnergyEngagementOverTime(user.uid),
        getWeeklyEngagementTrend(user.uid),
        getWeeklyEnergyTrend(user.uid),
        getCurrentWeekAverages(user.uid),
      ])

      setEnergyEngagementData(eedata)
      setWeeklyEngagementData(wengdata)
      setWeeklyEnergyData(wenedata)
      setCurrentWeekEnergy([
        {
          name: "Energy",
          value: Math.abs(currAverages.energy),
          displayValue: currAverages.energy,
          fill: currAverages.energy >= 0 ? "#3b82f6" : "#ef233c",
        },
      ])
      setCurrentWeekEngagement([
        { name: "Engagement", value: currAverages.engagement, fill: "#10b981" },
      ])
      setFetching(false)
    }

    loadInsights()
  }, [user])

  if (loading || fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    )
  }

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
            <CardTitle className="text-xl">Current Week's Engagement</CardTitle>
            <CardDescription>
              Average engagement level in the last 7 days
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
                endAngle={((currentWeekEngagement[0]?.value ?? 0) / 100) * 360}
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

        <Card className="pb-0 gap-0">
          <CardHeader className="items-center pb-0 text-center">
            <CardTitle className="text-xl">Current Week's Energy</CardTitle>
            <CardDescription>
              Average energy level in the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={radialChartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <RadialBarChart
                data={currentWeekEnergy}
                startAngle={0}
                endAngle={((currentWeekEnergy[0]?.value ?? 0) / 100) * 360}
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
                              {currentWeekEnergy[0].displayValue}%
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
                  type="monotone"
                  fill="var(--color-engagement)"
                  fillOpacity={0.4}
                  stroke="var(--color-engagement)"
                  stackId="a"
                />
                <Area
                  dataKey="energy"
                  type="monotone"
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
                  type="monotone"
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
                  type="monotone"
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
