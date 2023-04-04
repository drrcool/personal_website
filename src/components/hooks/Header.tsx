import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components"
import ThemeToggleButton from "../ThemeToggleButton";

const headerConfig = [
    {
        label: "Home",
        path: "/"
    },
    {
        label: "About Me",
        path: "/about"
    },
    {
        label: "Experience",
        path: "/experience"
    },
    {
        label: "Interests",
        path: "/interests"
    },
    {
        label: "Examples",
        path: "/examples"
    },
    {
        label: "Thoughts",
        path: "/thoughts"
    },
    {
        label: "Contact Me",
        path: "/contact"
    }
]
