"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className,
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border-0 p-4 pr-8 shadow-lg backdrop-blur-sm transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "bg-white/95 text-gray-900 shadow-xl ring-1 ring-gray-200/50",
        success:
          "bg-gradient-to-r from-emerald-50/95 to-green-50/95 text-emerald-900 shadow-xl ring-1 ring-emerald-200/50",
        destructive: "bg-gradient-to-r from-red-50/95 to-rose-50/95 text-red-900 shadow-xl ring-1 ring-red-200/50",
        warning: "bg-gradient-to-r from-amber-50/95 to-yellow-50/95 text-amber-900 shadow-xl ring-1 ring-amber-200/50",
        info: "bg-gradient-to-r from-blue-50/95 to-cyan-50/95 text-blue-900 shadow-xl ring-1 ring-blue-200/50",
        loading:
          "bg-gradient-to-r from-purple-50/95 to-indigo-50/95 text-purple-900 shadow-xl ring-1 ring-purple-200/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return <ToastPrimitives.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-lg border-0 bg-white/80 px-3 text-sm font-medium shadow-sm ring-1 ring-gray-200/50 transition-all hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.success]:bg-emerald-100/80 group-[.success]:text-emerald-700 group-[.success]:ring-emerald-200/50 group-[.success]:hover:bg-emerald-100 group-[.destructive]:bg-red-100/80 group-[.destructive]:text-red-700 group-[.destructive]:ring-red-200/50 group-[.destructive]:hover:bg-red-100 group-[.warning]:bg-amber-100/80 group-[.warning]:text-amber-700 group-[.warning]:ring-amber-200/50 group-[.warning]:hover:bg-amber-100 group-[.info]:bg-blue-100/80 group-[.info]:text-blue-700 group-[.info]:ring-blue-200/50 group-[.info]:hover:bg-blue-100 group-[.loading]:bg-purple-100/80 group-[.loading]:text-purple-700 group-[.loading]:ring-purple-200/50 group-[.loading]:hover:bg-purple-100",
      className,
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 cursor-pointer rounded-lg p-1 text-gray-400 opacity-70 transition-all hover:opacity-100 hover:bg-white/50 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-1 group-[.success]:text-emerald-500 group-[.success]:hover:bg-emerald-100/50 group-[.success]:focus:ring-emerald-400 group-[.destructive]:text-red-500 group-[.destructive]:hover:bg-red-100/50 group-[.destructive]:focus:ring-red-400 group-[.warning]:text-amber-500 group-[.warning]:hover:bg-amber-100/50 group-[.warning]:focus:ring-amber-400 group-[.info]:text-blue-500 group-[.info]:hover:bg-blue-100/50 group-[.info]:focus:ring-blue-400 group-[.loading]:text-purple-500 group-[.loading]:hover:bg-purple-100/50 group-[.loading]:focus:ring-purple-400",
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  const icons = {
    default: null,
    success: <CheckCircle className="h-5 w-5 text-emerald-600" />,
    destructive: <AlertCircle className="h-5 w-5 text-red-600" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-600" />,
    info: <Info className="h-5 w-5 text-blue-600" />,
    loading: <Loader2 className="h-5 w-5 text-purple-600 animate-spin" />,
  }

  const icon = variant ? icons[variant] : icons.default

  if (!icon) return null

  return (
    <div ref={ref} className={cn("flex-shrink-0", className)} {...props}>
      {icon}
    </div>
  )
})
ToastIcon.displayName = "ToastIcon"

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description ref={ref} className={cn("text-sm opacity-80 leading-relaxed", className)} {...props} />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastIcon,
}
