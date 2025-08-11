"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { Badge } from "@/components/ui/badge";

const multiSelectVariants = cva(
    "flex h-full w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "border-foreground/20",
                secondary:
                    "border-foreground/20 bg-secondary text-secondary-foreground",
                destructive:
                    "border-destructive/50 text-destructive-foreground",
                ghost: "border-transparent",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

interface MultiSelectProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
    options: {
        value: string;
        label: string;
        icon?: React.ComponentType<{ className?: string }>;
    }[];
    onValueChange: (value: string[]) => void;
    defaultValue: string[];
    placeholder?: string;
    animation?: number;
    maxCount?: number;
    asChild?: boolean;
    className?: string;
}

const MultiSelect = React.forwardRef<
    HTMLButtonElement,
    MultiSelectProps
>(
    (
        {
            options,
            onValueChange,
            variant,
            defaultValue = [],
            placeholder = "Select options",
            animation = 0,
            maxCount = 3,
            asChild = false,
            className,
            ...props
        },
        ref
    ) => {
        const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue);
        const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
        const [isFocused, setIsFocused] = React.useState(false);
        const inputRef = React.useRef<HTMLInputElement>(null);


        React.useEffect(() => {
            setSelectedValues(defaultValue);
        }, [defaultValue]);

        const handleInputKeyDown = (
            event: React.KeyboardEvent<HTMLInputElement>
        ) => {
            if (event.key === "Enter") {
                setIsPopoverOpen(true);
            } else if (
                event.key === "Backspace" &&
                !event.currentTarget.value
            ) {
                const newSelectedValues = [...selectedValues];
                newSelectedValues.pop();
                setSelectedValues(newSelectedValues);
                onValueChange(newSelectedValues);
            }
        };

        const toggleOption = (value: string) => {
            const newSelectedValues = selectedValues.includes(value)
                ? selectedValues.filter((v) => v !== value)
                : [...selectedValues, value];
            setSelectedValues(newSelectedValues);
            onValueChange(newSelectedValues);
        };

        return (
            <CommandPrimitive
                onKeyDown={(e) => {
                    if (e.key === "Escape") {
                        inputRef.current?.blur();
                    }
                }}
            >
                <div>
                    <div className="group rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                        <div className="flex flex-wrap gap-1">
                            {selectedValues.map((value) => {
                                const option = options.find((o) => o.value === value);
                                return (
                                    <Badge
                                        key={value}
                                        variant="secondary"
                                        className="rounded-sm"
                                    >
                                        {option?.label}
                                        <button
                                            className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                            onClick={() => toggleOption(value)}
                                        >
                                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                        </button>
                                    </Badge>
                                );
                            })}
                            <CommandPrimitive.Input
                                onKeyDown={handleInputKeyDown}
                                onFocus={() => setIsPopoverOpen(true)}
                                onBlur={() => setIsPopoverOpen(false)}
                                placeholder={placeholder}
                                className="ml-2 flex-1 bg-white outline-none placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>
                    <div className="relative mt-2">
                        {isPopoverOpen && (
                            <CommandList className="absolute top-0 z-10 w-full rounded-md border bg-white text-popover-foreground shadow-md outline-none animate-in">
                                <CommandGroup>
                                    {options.map((option) => {
                                        const isSelected = selectedValues.includes(option.value);
                                        return (
                                            <CommandItem
                                                key={option.value}
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }}
                                                onSelect={() => {
                                                    toggleOption(option.value);
                                                    inputRef.current?.focus();
                                                }}
                                                style={{
                                                    pointerEvents: "auto",
                                                    opacity: 1,
                                                }}
                                                className="cursor-pointer"
                                            >
                                                <div
                                                    className={cn(
                                                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                        isSelected
                                                            ? "bg-primary text-primary-foreground"
                                                            : "opacity-50 [&_svg]:invisible"
                                                    )}
                                                >
                                                    ✓
                                                </div>
                                                {option.icon && (
                                                    <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                                                )}
                                                <span>{option.label}</span>
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            </CommandList>
                        )}
                    </div>
                </div>
            </CommandPrimitive>
        );
    }
);

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };