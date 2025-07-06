import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs";

mermaid.initialize({
    startOnLoad: true,
    theme: "base",
    themeVariables: {
        fontSize: "12px",
    },
    flowchart: {
        nodeSpacing: 10,
        rankSpacing: 25,
    },
});

const monthLayout = [
    [  "",   "",   "",   "",   "",   "",  "1",  "2",  "3",  "4",  "5",  "6",  "7"],
    [ "2",  "3",  "4",  "5",  "6",  "7",  "8",  "9", "10", "11", "12", "13", "14"],
    [ "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21"],
    ["16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28"],
    ["23", "24", "25", "26", "27", "28", "29", "30", "31",   "",   "",   "",   ""],
    ["30", "31",   "",   "",   "",   "",   "",   "",   "",   "",   "",   "",   ""]
];

function viewMonth(){}