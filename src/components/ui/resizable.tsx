"use client"

import * as React from "react"
import { GripVerticalIcon } from "lucide-react"
import { Group, Panel, Separator } from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = Group

const ResizablePanel = Panel

const ResizableHandle = Separator

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }