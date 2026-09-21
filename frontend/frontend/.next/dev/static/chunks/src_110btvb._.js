(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/dashboard/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/briefcase.mjs [app-client] (ecmascript) <export default as Briefcase>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.mjs [app-client] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DashboardHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/DashboardHeader.tsx [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/components/ResumeUploadCard'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AssessmentSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/AssessmentSidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CompanyMatchCarousel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CompanyMatchCarousel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$KeyStrengths$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/KeyStrengths.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SmartSuggestions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/SmartSuggestions.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$KeywordSkillOptimization$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/KeywordSkillOptimization.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$FormattingReadability$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/FormattingReadability.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
const VIOLET_TONE = 'border-[#8b5cf6]/20 bg-[#8b5cf6]/10 text-[#8b5cf6]';
const AMBER_TONE = 'border-[#f59e0b]/20 bg-[#f59e0b]/10 text-[#f59e0b]';
// Shared decorative background (orbs, dot grid, accent line, rings) from the Figma frame.
function Background() {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(2);
    if ($[0] !== "7450be9ce2148260e8c6aaac9ab9aba8916ea8a134d275fcd0e464765da1b470") {
        for(let $i = 0; $i < 2; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "7450be9ce2148260e8c6aaac9ab9aba8916ea8a134d275fcd0e464765da1b470";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "aria-hidden": true,
            className: "pointer-events-none absolute inset-0 overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute -left-[220px] -top-[220px] size-[940px] rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.38)_0%,rgba(167,139,250,0.16)_38%,rgba(167,139,250,0)_70%)]"
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/page.tsx",
                    lineNumber: 31,
                    columnNumber: 99
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute -right-[220px] top-[120px] size-[800px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.30)_0%,rgba(34,211,238,0.12)_40%,rgba(34,211,238,0)_70%)]"
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/page.tsx",
                    lineNumber: 31,
                    columnNumber: 286
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute left-[calc(50%-250px)] top-[700px] size-[620px] rounded-full bg-[radial-gradient(circle,rgba(251,113,133,0.18)_0%,rgba(251,113,133,0.06)_40%,rgba(251,113,133,0)_70%)]"
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/page.tsx",
                    lineNumber: 31,
                    columnNumber: 470
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute left-0 top-0 h-[960px] w-full opacity-[0.06] [background-image:radial-gradient(circle,#7c3aed_1px,transparent_1px)] [background-size:24px_24px]"
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/page.tsx",
                    lineNumber: 31,
                    columnNumber: 665
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute left-0 top-0 h-[3px] w-full bg-[linear-gradient(90deg,#8b5cf6_0%,#06b6d4_50%,rgba(139,92,246,0)_100%)]"
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/page.tsx",
                    lineNumber: 31,
                    columnNumber: 837
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute -right-[120px] -top-[120px] size-[340px] rounded-full border border-[#8b5cf6]/20"
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/page.tsx",
                    lineNumber: 31,
                    columnNumber: 968
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute -right-[80px] -top-[80px] size-[260px] rounded-full border border-[#8b5cf6]/20"
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/page.tsx",
                    lineNumber: 31,
                    columnNumber: 1077
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 31,
            columnNumber: 10
        }, this);
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    return t0;
}
_c = Background;
function SectionHeader(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(16);
    if ($[0] !== "7450be9ce2148260e8c6aaac9ab9aba8916ea8a134d275fcd0e464765da1b470") {
        for(let $i = 0; $i < 16; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "7450be9ce2148260e8c6aaac9ab9aba8916ea8a134d275fcd0e464765da1b470";
    }
    const { icon: Icon, tone, title, subtitle } = t0;
    const t1 = `flex shrink-0 items-center justify-center rounded-[12px] border p-[10px] ${tone}`;
    let t2;
    if ($[1] !== Icon) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
            className: "size-5"
        }, void 0, false, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 55,
            columnNumber: 10
        }, this);
        $[1] = Icon;
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    let t3;
    if ($[3] !== t1 || $[4] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            children: t2
        }, void 0, false, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 63,
            columnNumber: 10
        }, this);
        $[3] = t1;
        $[4] = t2;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    let t4;
    if ($[6] !== title) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-[18px] font-bold leading-tight text-[#111827]",
            children: title
        }, void 0, false, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 72,
            columnNumber: 10
        }, this);
        $[6] = title;
        $[7] = t4;
    } else {
        t4 = $[7];
    }
    let t5;
    if ($[8] !== subtitle) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-[13px] text-[#4b5563]",
            children: subtitle
        }, void 0, false, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 80,
            columnNumber: 10
        }, this);
        $[8] = subtitle;
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    let t6;
    if ($[10] !== t4 || $[11] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-w-0 flex-1 flex-col gap-1",
            children: [
                t4,
                t5
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 88,
            columnNumber: 10
        }, this);
        $[10] = t4;
        $[11] = t5;
        $[12] = t6;
    } else {
        t6 = $[12];
    }
    let t7;
    if ($[13] !== t3 || $[14] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-[14px]",
            children: [
                t3,
                t6
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 97,
            columnNumber: 10
        }, this);
        $[13] = t3;
        $[14] = t6;
        $[15] = t7;
    } else {
        t7 = $[15];
    }
    return t7;
}
_c1 = SectionHeader;
function StatCard(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(8);
    if ($[0] !== "7450be9ce2148260e8c6aaac9ab9aba8916ea8a134d275fcd0e464765da1b470") {
        for(let $i = 0; $i < 8; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "7450be9ce2148260e8c6aaac9ab9aba8916ea8a134d275fcd0e464765da1b470";
    }
    const { label, value } = t0;
    let t1;
    if ($[1] !== label) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-[14px] font-semibold text-[#4b5563]",
            children: label
        }, void 0, false, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 120,
            columnNumber: 10
        }, this);
        $[1] = label;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] !== value) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-[36px] font-extrabold leading-none text-[#111827]",
            children: value
        }, void 0, false, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 128,
            columnNumber: 10
        }, this);
        $[3] = value;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    let t3;
    if ($[5] !== t1 || $[6] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-3 rounded-[20px] border-[1.5px] border-white bg-white/[0.72] p-6 shadow-[0_10px_30px_rgba(17,24,39,0.03)] backdrop-blur-[12px]",
            children: [
                t1,
                t2
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 136,
            columnNumber: 10
        }, this);
        $[5] = t1;
        $[6] = t2;
        $[7] = t3;
    } else {
        t3 = $[7];
    }
    return t3;
}
_c2 = StatCard;
function DashboardPage() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(64);
    if ($[0] !== "7450be9ce2148260e8c6aaac9ab9aba8916ea8a134d275fcd0e464765da1b470") {
        for(let $i = 0; $i < 64; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "7450be9ce2148260e8c6aaac9ab9aba8916ea8a134d275fcd0e464765da1b470";
    }
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [notFound, setNotFound] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const loaded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    let t0;
    if ($[1] !== router) {
        t0 = ({
            "DashboardPage[handleAnalyze]": ()=>{
                router.push("/upload");
            }
        })["DashboardPage[handleAnalyze]"];
        $[1] = router;
        $[2] = t0;
    } else {
        t0 = $[2];
    }
    const handleAnalyze = t0;
    let t1;
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = ({
            "DashboardPage[useEffect()]": ()=>{
                if (loaded.current) {
                    return;
                }
                loaded.current = true;
                const raw = sessionStorage.getItem("aura_result");
                if (!raw) {
                    setNotFound(true);
                    return;
                }
                try {
                    const parsed = JSON.parse(raw);
                    setResult(parsed);
                    sessionStorage.removeItem("aura_result");
                } catch  {
                    setNotFound(true);
                }
            }
        })["DashboardPage[useEffect()]"];
        t2 = [];
        $[3] = t1;
        $[4] = t2;
    } else {
        t1 = $[3];
        t2 = $[4];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t1, t2);
    if (notFound) {
        let t3;
        if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
            t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Background, {}, void 0, false, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 204,
                columnNumber: 12
            }, this);
            $[5] = t3;
        } else {
            t3 = $[5];
        }
        let t4;
        if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
            t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f0eeff] px-4",
                children: [
                    t3,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative z-10 w-full max-w-md rounded-[24px] border-[1.5px] border-white bg-white/[0.72] p-8 text-center shadow-[0_10px_30px_rgba(17,24,39,0.03)] backdrop-blur-[12px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mb-5 text-lg font-semibold text-[#4b5563]",
                                children: "No analysis found."
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 211,
                                columnNumber: 306
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/upload",
                                className: "inline-flex rounded-full bg-gradient-to-r from-[#7c3aed] via-[#a78bfa] via-[60%] to-[#06b6d4] px-8 py-[14px] text-[15px] font-bold text-white shadow-[0_8px_12px_rgba(124,58,237,0.2)] transition-opacity hover:opacity-90",
                                children: "Upload a Resume"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 211,
                                columnNumber: 385
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 211,
                        columnNumber: 122
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 211,
                columnNumber: 12
            }, this);
            $[6] = t4;
        } else {
            t4 = $[6];
        }
        return t4;
    }
    if (!result) {
        let t3;
        if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
            t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f0eeff]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Background, {}, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 221,
                        columnNumber: 113
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "relative z-10 text-sm font-medium text-[#9ca3af]",
                        children: "Loading analysis…"
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 221,
                        columnNumber: 127
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 221,
                columnNumber: 12
            }, this);
            $[7] = t3;
        } else {
            t3 = $[7];
        }
        return t3;
    }
    let t3;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Background, {}, void 0, false, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 230,
            columnNumber: 10
        }, this);
        $[8] = t3;
    } else {
        t3 = $[8];
    }
    let t4;
    if ($[9] !== result) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DashboardHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            result: result
        }, void 0, false, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 237,
            columnNumber: 10
        }, this);
        $[9] = result;
        $[10] = t4;
    } else {
        t4 = $[10];
    }
    let t5;
    if ($[11] !== result.keywords) {
        t5 = result.keywords.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-wrap items-center gap-2",
            children: result.keywords.map(_DashboardPageResultKeywordsMap)
        }, void 0, false, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 245,
            columnNumber: 40
        }, this);
        $[11] = result.keywords;
        $[12] = t5;
    } else {
        t5 = $[12];
    }
    let t6;
    if ($[13] !== t4 || $[14] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-4",
            children: [
                t4,
                t5
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 253,
            columnNumber: 10
        }, this);
        $[13] = t4;
        $[14] = t5;
        $[15] = t6;
    } else {
        t6 = $[15];
    }
    let t7;
    if ($[16] !== handleAnalyze) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResumeUploadCard, {
            onAnalyze: handleAnalyze
        }, void 0, false, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 262,
            columnNumber: 10
        }, this);
        $[16] = handleAnalyze;
        $[17] = t7;
    } else {
        t7 = $[17];
    }
    let t8;
    if ($[18] !== result.ats_score || $[19] !== result.sections) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full min-w-0",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AssessmentSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                score: result.ats_score,
                sections: result.sections
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 270,
                columnNumber: 42
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 270,
            columnNumber: 10
        }, this);
        $[18] = result.ats_score;
        $[19] = result.sections;
        $[20] = t8;
    } else {
        t8 = $[20];
    }
    let t9;
    if ($[21] !== t7 || $[22] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_420px]",
            children: [
                t7,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 279,
            columnNumber: 10
        }, this);
        $[21] = t7;
        $[22] = t8;
        $[23] = t9;
    } else {
        t9 = $[23];
    }
    let t10;
    if ($[24] !== result.total_jobs) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
            label: "Jobs Found",
            value: result.total_jobs
        }, void 0, false, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 288,
            columnNumber: 11
        }, this);
        $[24] = result.total_jobs;
        $[25] = t10;
    } else {
        t10 = $[25];
    }
    let t11;
    if ($[26] !== result.top_jobs.length) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
            label: "Top Job Matches",
            value: result.top_jobs.length
        }, void 0, false, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 296,
            columnNumber: 11
        }, this);
        $[26] = result.top_jobs.length;
        $[27] = t11;
    } else {
        t11 = $[27];
    }
    let t12;
    if ($[28] !== result.keywords.length) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
            label: "Keywords Found",
            value: result.keywords.length
        }, void 0, false, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 304,
            columnNumber: 11
        }, this);
        $[28] = result.keywords.length;
        $[29] = t12;
    } else {
        t12 = $[29];
    }
    let t13;
    if ($[30] !== t10 || $[31] !== t11 || $[32] !== t12) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 gap-6 md:grid-cols-3",
            children: [
                t10,
                t11,
                t12
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 312,
            columnNumber: 11
        }, this);
        $[30] = t10;
        $[31] = t11;
        $[32] = t12;
        $[33] = t13;
    } else {
        t13 = $[33];
    }
    let t14;
    if ($[34] !== result.skill_gaps) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$KeywordSkillOptimization$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            skillGaps: result.skill_gaps
        }, void 0, false, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 322,
            columnNumber: 11
        }, this);
        $[34] = result.skill_gaps;
        $[35] = t14;
    } else {
        t14 = $[35];
    }
    let t15;
    if ($[36] !== result.companies) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CompanyMatchCarousel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            companies: result.companies
        }, void 0, false, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 330,
            columnNumber: 11
        }, this);
        $[36] = result.companies;
        $[37] = t15;
    } else {
        t15 = $[37];
    }
    let t16;
    if ($[38] !== result.grammar_issues) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$FormattingReadability$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            grammarIssues: result.grammar_issues
        }, void 0, false, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 338,
            columnNumber: 11
        }, this);
        $[38] = result.grammar_issues;
        $[39] = t16;
    } else {
        t16 = $[39];
    }
    let t17;
    if ($[40] === Symbol.for("react.memo_cache_sentinel")) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"],
            tone: AMBER_TONE,
            title: "Insights & Recommendations",
            subtitle: "AI-powered analysis of your resume strengths and areas for improvement"
        }, void 0, false, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 346,
            columnNumber: 11
        }, this);
        $[40] = t17;
    } else {
        t17 = $[40];
    }
    let t18;
    if ($[41] !== result.strengths) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$KeyStrengths$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            strengths: result.strengths
        }, void 0, false, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 353,
            columnNumber: 11
        }, this);
        $[41] = result.strengths;
        $[42] = t18;
    } else {
        t18 = $[42];
    }
    let t19;
    if ($[43] !== result.improvements) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SmartSuggestions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            improvements: result.improvements
        }, void 0, false, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 361,
            columnNumber: 11
        }, this);
        $[43] = result.improvements;
        $[44] = t19;
    } else {
        t19 = $[44];
    }
    let t20;
    if ($[45] !== t18 || $[46] !== t19) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "flex flex-col gap-6 rounded-[24px] border-[1.5px] border-white bg-white/[0.72] p-8 shadow-[0_10px_30px_rgba(17,24,39,0.03)] backdrop-blur-[12px]",
            children: [
                t17,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 gap-5 md:grid-cols-2",
                    children: [
                        t18,
                        t19
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/dashboard/page.tsx",
                    lineNumber: 369,
                    columnNumber: 182
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 369,
            columnNumber: 11
        }, this);
        $[45] = t18;
        $[46] = t19;
        $[47] = t20;
    } else {
        t20 = $[47];
    }
    let t21;
    if ($[48] === Symbol.for("react.memo_cache_sentinel")) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__["Briefcase"],
            tone: VIOLET_TONE,
            title: "Top Job Matches",
            subtitle: "Roles with the strongest match to your resume"
        }, void 0, false, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 378,
            columnNumber: 11
        }, this);
        $[48] = t21;
    } else {
        t21 = $[48];
    }
    let t22;
    if ($[49] !== result.top_jobs) {
        t22 = result.top_jobs.map(_DashboardPageResultTop_jobsMap);
        $[49] = result.top_jobs;
        $[50] = t22;
    } else {
        t22 = $[50];
    }
    let t23;
    if ($[51] !== t22) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "flex flex-col gap-6 rounded-[24px] border-[1.5px] border-white bg-white/[0.72] p-8 shadow-[0_10px_30px_rgba(17,24,39,0.03)] backdrop-blur-[12px]",
            children: [
                t21,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-3",
                    children: t22
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/page.tsx",
                    lineNumber: 393,
                    columnNumber: 182
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 393,
            columnNumber: 11
        }, this);
        $[51] = t22;
        $[52] = t23;
    } else {
        t23 = $[52];
    }
    let t24;
    if ($[53] !== t14 || $[54] !== t15 || $[55] !== t16 || $[56] !== t20 || $[57] !== t23) {
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-6",
            children: [
                t14,
                t15,
                t16,
                t20,
                t23
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 401,
            columnNumber: 11
        }, this);
        $[53] = t14;
        $[54] = t15;
        $[55] = t16;
        $[56] = t20;
        $[57] = t23;
        $[58] = t24;
    } else {
        t24 = $[58];
    }
    let t25;
    if ($[59] !== t13 || $[60] !== t24 || $[61] !== t6 || $[62] !== t9) {
        t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative min-h-screen w-full overflow-x-clip bg-[#f0eeff]",
            children: [
                t3,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative z-10 mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 pb-16 pt-[120px] sm:px-10 lg:px-20",
                    children: [
                        t6,
                        t9,
                        t13,
                        t24
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/dashboard/page.tsx",
                    lineNumber: 413,
                    columnNumber: 90
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 413,
            columnNumber: 11
        }, this);
        $[59] = t13;
        $[60] = t24;
        $[61] = t6;
        $[62] = t9;
        $[63] = t25;
    } else {
        t25 = $[63];
    }
    return t25;
}
_s(DashboardPage, "n+RpVDZmWwbcs9xK9SUgFGmKrc0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c3 = DashboardPage;
function _DashboardPageResultTop_jobsMap(job, i) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
        href: job.url,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "group block rounded-[16px] border-[1.5px] border-white bg-white/[0.72] p-4 shadow-[0_10px_30px_rgba(17,24,39,0.03)] transition-all hover:border-[#8b5cf6]/30 hover:bg-white",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-start justify-between gap-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-w-0 flex-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "truncate text-[15px] font-bold text-[#111827] group-hover:text-[#7c3aed]",
                            children: job.title
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/page.tsx",
                            lineNumber: 425,
                            columnNumber: 383
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-1 text-[13px] text-[#4b5563]",
                            children: [
                                job.company,
                                " · ",
                                job.location
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/dashboard/page.tsx",
                            lineNumber: 425,
                            columnNumber: 486
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-1 line-clamp-2 text-xs leading-relaxed text-[#9ca3af]",
                            children: job.description
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/page.tsx",
                            lineNumber: 425,
                            columnNumber: 567
                        }, this),
                        job.matched_skills.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2 flex flex-wrap gap-1",
                            children: job.matched_skills.slice(0, 4).map(_DashboardPageResultTop_jobsMapAnonymous)
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/page.tsx",
                            lineNumber: 425,
                            columnNumber: 694
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/dashboard/page.tsx",
                    lineNumber: 425,
                    columnNumber: 351
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "shrink-0 text-right",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] bg-clip-text text-lg font-black text-transparent",
                            children: job.total_score
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/page.tsx",
                            lineNumber: 425,
                            columnNumber: 865
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[10px] font-bold uppercase tracking-wider text-[#9ca3af]",
                            children: "Score"
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/page.tsx",
                            lineNumber: 425,
                            columnNumber: 1001
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/dashboard/page.tsx",
                    lineNumber: 425,
                    columnNumber: 828
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 425,
            columnNumber: 295
        }, this)
    }, `${job.title}-${job.company}-${i}`, false, {
        fileName: "[project]/src/app/dashboard/page.tsx",
        lineNumber: 425,
        columnNumber: 10
    }, this);
}
function _DashboardPageResultTop_jobsMapAnonymous(skill, skillIndex) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600",
        children: skill
    }, `${skill}-${skillIndex}`, false, {
        fileName: "[project]/src/app/dashboard/page.tsx",
        lineNumber: 428,
        columnNumber: 10
    }, this);
}
function _DashboardPageResultKeywordsMap(kw) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "rounded-full border border-[#7c3aed]/20 bg-[#7c3aed]/[0.08] px-3 py-1 text-xs font-bold text-[#7c3aed]",
        children: kw
    }, kw, false, {
        fileName: "[project]/src/app/dashboard/page.tsx",
        lineNumber: 431,
        columnNumber: 10
    }, this);
}
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "Background");
__turbopack_context__.k.register(_c1, "SectionHeader");
__turbopack_context__.k.register(_c2, "StatCard");
__turbopack_context__.k.register(_c3, "DashboardPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/AssessmentSidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AssessmentSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$scan$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Scan$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/scan.mjs [app-client] (ecmascript) <export default as Scan>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/PieChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/polar/Pie.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Cell.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/BarChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Bar.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/XAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/YAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [app-client] (ecmascript)");
'use client';
;
;
;
;
// Circular donut chart showing the overall score percentage
function ScoreChart(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(24);
    if ($[0] !== "96467c0cfacd3c5573221ceb8734f48616ea3489322e81419a41665f6b3d94e4") {
        for(let $i = 0; $i < 24; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "96467c0cfacd3c5573221ceb8734f48616ea3489322e81419a41665f6b3d94e4";
    }
    const { score, label: t1 } = t0;
    const label = t1 === undefined ? "ATS Score" : t1;
    let t2;
    if ($[1] !== score) {
        t2 = {
            name: "Score",
            value: score
        };
        $[1] = score;
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    const t3 = 100 - score;
    let t4;
    if ($[3] !== t3) {
        t4 = {
            name: "Remaining",
            value: t3
        };
        $[3] = t3;
        $[4] = t4;
    } else {
        t4 = $[4];
    }
    let t5;
    if ($[5] !== t2 || $[6] !== t4) {
        t5 = [
            t2,
            t4
        ];
        $[5] = t2;
        $[6] = t4;
        $[7] = t5;
    } else {
        t5 = $[7];
    }
    const data = t5;
    const t6 = score > 80 ? "#22c55e" : score > 60 ? "#d946ef" : "#ef4444";
    let t7;
    if ($[8] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cell"], {
            fill: t6
        }, void 0, false, {
            fileName: "[project]/src/components/AssessmentSidebar.tsx",
            lineNumber: 65,
            columnNumber: 10
        }, this);
        $[8] = t6;
        $[9] = t7;
    } else {
        t7 = $[9];
    }
    let t8;
    if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cell"], {
            fill: "rgba(255,255,255,0.08)"
        }, void 0, false, {
            fileName: "[project]/src/components/AssessmentSidebar.tsx",
            lineNumber: 73,
            columnNumber: 10
        }, this);
        $[10] = t8;
    } else {
        t8 = $[10];
    }
    let t9;
    if ($[11] !== data || $[12] !== t7) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
            width: "100%",
            height: "100%",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PieChart"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Pie"], {
                    data: data,
                    innerRadius: "75%",
                    outerRadius: "100%",
                    paddingAngle: 5,
                    dataKey: "value",
                    startAngle: 90,
                    endAngle: -270,
                    children: [
                        t7,
                        t8
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/AssessmentSidebar.tsx",
                    lineNumber: 80,
                    columnNumber: 68
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/AssessmentSidebar.tsx",
                lineNumber: 80,
                columnNumber: 58
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/AssessmentSidebar.tsx",
            lineNumber: 80,
            columnNumber: 10
        }, this);
        $[11] = data;
        $[12] = t7;
        $[13] = t9;
    } else {
        t9 = $[13];
    }
    let t10;
    if ($[14] !== score) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-3xl font-extrabold text-white",
            children: [
                score,
                "%"
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/AssessmentSidebar.tsx",
            lineNumber: 89,
            columnNumber: 11
        }, this);
        $[14] = score;
        $[15] = t10;
    } else {
        t10 = $[15];
    }
    let t11;
    if ($[16] !== label) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-[10px] font-bold uppercase tracking-wider text-white/40",
            children: label
        }, void 0, false, {
            fileName: "[project]/src/components/AssessmentSidebar.tsx",
            lineNumber: 97,
            columnNumber: 11
        }, this);
        $[16] = label;
        $[17] = t11;
    } else {
        t11 = $[17];
    }
    let t12;
    if ($[18] !== t10 || $[19] !== t11) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute inset-0 flex flex-col items-center justify-center",
            children: [
                t10,
                t11
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/AssessmentSidebar.tsx",
            lineNumber: 105,
            columnNumber: 11
        }, this);
        $[18] = t10;
        $[19] = t11;
        $[20] = t12;
    } else {
        t12 = $[20];
    }
    let t13;
    if ($[21] !== t12 || $[22] !== t9) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative mx-auto aspect-square w-full max-w-[180px]",
            children: [
                t9,
                t12
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/AssessmentSidebar.tsx",
            lineNumber: 114,
            columnNumber: 11
        }, this);
        $[21] = t12;
        $[22] = t9;
        $[23] = t13;
    } else {
        t13 = $[23];
    }
    return t13;
}
_c = ScoreChart;
function AssessmentSidebar(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(17);
    if ($[0] !== "96467c0cfacd3c5573221ceb8734f48616ea3489322e81419a41665f6b3d94e4") {
        for(let $i = 0; $i < 17; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "96467c0cfacd3c5573221ceb8734f48616ea3489322e81419a41665f6b3d94e4";
    }
    const { score, sections } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "mb-6 text-sm font-bold uppercase tracking-widest text-white/40",
            children: "Overall Assessment"
        }, void 0, false, {
            fileName: "[project]/src/components/AssessmentSidebar.tsx",
            lineNumber: 137,
            columnNumber: 10
        }, this);
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] !== score) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScoreChart, {
                score: score
            }, void 0, false, {
                fileName: "[project]/src/components/AssessmentSidebar.tsx",
                lineNumber: 144,
                columnNumber: 37
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/AssessmentSidebar.tsx",
            lineNumber: 144,
            columnNumber: 10
        }, this);
        $[2] = score;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-8 space-y-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-center text-xs font-semibold leading-relaxed text-fuchsia-300",
                    children: [
                        "Resume complexity is",
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-bold",
                            children: "Optimal"
                        }, void 0, false, {
                            fileName: "[project]/src/components/AssessmentSidebar.tsx",
                            lineNumber: 152,
                            columnNumber: 229
                        }, this),
                        " for Executive-level parsing."
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/AssessmentSidebar.tsx",
                    lineNumber: 152,
                    columnNumber: 122
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/AssessmentSidebar.tsx",
                lineNumber: 152,
                columnNumber: 42
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/AssessmentSidebar.tsx",
            lineNumber: 152,
            columnNumber: 10
        }, this);
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    let t4;
    if ($[5] !== t2) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-3xl border border-white/[0.07] bg-[#151221]/70 p-6 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]",
            children: [
                t1,
                t2,
                t3
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/AssessmentSidebar.tsx",
            lineNumber: 159,
            columnNumber: 10
        }, this);
        $[5] = t2;
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    let t5;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/40",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$scan$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Scan$3e$__["Scan"], {
                    className: "size-4 text-fuchsia-400"
                }, void 0, false, {
                    fileName: "[project]/src/components/AssessmentSidebar.tsx",
                    lineNumber: 167,
                    columnNumber: 113
                }, this),
                "Dimension Analysis"
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/AssessmentSidebar.tsx",
            lineNumber: 167,
            columnNumber: 10
        }, this);
        $[7] = t5;
    } else {
        t5 = $[7];
    }
    let t6;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
            type: "number",
            hide: true
        }, void 0, false, {
            fileName: "[project]/src/components/AssessmentSidebar.tsx",
            lineNumber: 174,
            columnNumber: 10
        }, this);
        $[8] = t6;
    } else {
        t6 = $[8];
    }
    let t7;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {
            dataKey: "name",
            type: "category",
            width: 90,
            fontSize: 10,
            fontWeight: 700,
            stroke: "rgba(255,255,255,0.5)",
            tick: {
                fill: "rgba(255,255,255,0.5)"
            }
        }, void 0, false, {
            fileName: "[project]/src/components/AssessmentSidebar.tsx",
            lineNumber: 181,
            columnNumber: 10
        }, this);
        $[9] = t7;
    } else {
        t7 = $[9];
    }
    let t8;
    if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
            cursor: {
                fill: "rgba(255,255,255,0.04)"
            },
            contentStyle: {
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "#1a1726",
                color: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.35)"
            }
        }, void 0, false, {
            fileName: "[project]/src/components/AssessmentSidebar.tsx",
            lineNumber: 190,
            columnNumber: 10
        }, this);
        $[10] = t8;
    } else {
        t8 = $[10];
    }
    let t9;
    if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bar"], {
            dataKey: "value",
            fill: "#d946ef",
            radius: [
                0,
                4,
                4,
                0
            ],
            barSize: 14
        }, void 0, false, {
            fileName: "[project]/src/components/AssessmentSidebar.tsx",
            lineNumber: 205,
            columnNumber: 10
        }, this);
        $[11] = t9;
    } else {
        t9 = $[11];
    }
    let t10;
    if ($[12] !== sections) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-3xl border border-white/[0.07] bg-[#151221]/70 p-6 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]",
            children: [
                t5,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-64 w-full",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                        width: "100%",
                        height: "100%",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"], {
                            data: sections,
                            layout: "vertical",
                            children: [
                                t6,
                                t7,
                                t8,
                                t9
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/AssessmentSidebar.tsx",
                            lineNumber: 212,
                            columnNumber: 233
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/AssessmentSidebar.tsx",
                        lineNumber: 212,
                        columnNumber: 185
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/AssessmentSidebar.tsx",
                    lineNumber: 212,
                    columnNumber: 156
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/AssessmentSidebar.tsx",
            lineNumber: 212,
            columnNumber: 11
        }, this);
        $[12] = sections;
        $[13] = t10;
    } else {
        t10 = $[13];
    }
    let t11;
    if ($[14] !== t10 || $[15] !== t4) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-4 lg:col-span-1",
            children: [
                t4,
                t10
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/AssessmentSidebar.tsx",
            lineNumber: 220,
            columnNumber: 11
        }, this);
        $[14] = t10;
        $[15] = t4;
        $[16] = t11;
    } else {
        t11 = $[16];
    }
    return t11;
}
_c1 = AssessmentSidebar;
var _c, _c1;
__turbopack_context__.k.register(_c, "ScoreChart");
__turbopack_context__.k.register(_c1, "AssessmentSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/CompanyMatchCarousel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CompanyMatchCarousel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$motion$2f$dist$2f$es$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/motion/dist/es/react.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.mjs [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.mjs [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.mjs [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/briefcase.mjs [app-client] (ecmascript) <export default as Briefcase>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.mjs [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dollar-sign.mjs [app-client] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.mjs [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-client] (ecmascript) <export default as CheckCircle2>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
// Shared dark select style, matching the settings/profile inputs
const DARK_SELECT_CLASSES = 'w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-fuchsia-500/50 focus:ring-2 focus:ring-fuchsia-500/20';
function CompanyMatchCarousel(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(56);
    if ($[0] !== "56e09efb06a72398646dc6f192a875738243fa5aab16ef51b6eadbc545583730") {
        for(let $i = 0; $i < 56; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "56e09efb06a72398646dc6f192a875738243fa5aab16ef51b6eadbc545583730";
    }
    const { companies } = t0;
    const [locationFilter, setLocationFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("All");
    const [jobTypeFilter, setJobTypeFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("All");
    const [experienceLevelFilter, setExperienceLevelFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("All");
    const [currentIndex, setCurrentIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    let t1;
    if ($[1] !== companies || $[2] !== experienceLevelFilter || $[3] !== jobTypeFilter || $[4] !== locationFilter) {
        let t2;
        if ($[6] !== experienceLevelFilter || $[7] !== jobTypeFilter || $[8] !== locationFilter) {
            t2 = ({
                "CompanyMatchCarousel[companies.filter()]": (company)=>{
                    if (locationFilter !== "All" && !company.location.includes(locationFilter)) {
                        return false;
                    }
                    if (jobTypeFilter !== "All" && company.jobType !== jobTypeFilter) {
                        return false;
                    }
                    if (experienceLevelFilter !== "All" && !company.experienceLevel.includes(experienceLevelFilter)) {
                        return false;
                    }
                    return true;
                }
            })["CompanyMatchCarousel[companies.filter()]"];
            $[6] = experienceLevelFilter;
            $[7] = jobTypeFilter;
            $[8] = locationFilter;
            $[9] = t2;
        } else {
            t2 = $[9];
        }
        t1 = companies.filter(t2);
        $[1] = companies;
        $[2] = experienceLevelFilter;
        $[3] = jobTypeFilter;
        $[4] = locationFilter;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    const filteredCompanies = t1;
    const activeCompany = filteredCompanies.length > 0 ? filteredCompanies[Math.min(currentIndex, filteredCompanies.length - 1)] : null;
    let t2;
    if ($[10] !== filteredCompanies.length) {
        t2 = ({
            "CompanyMatchCarousel[nextCompany]": ()=>{
                setCurrentIndex({
                    "CompanyMatchCarousel[nextCompany > setCurrentIndex()]": (prev)=>prev === filteredCompanies.length - 1 ? 0 : prev + 1
                }["CompanyMatchCarousel[nextCompany > setCurrentIndex()]"]);
            }
        })["CompanyMatchCarousel[nextCompany]"];
        $[10] = filteredCompanies.length;
        $[11] = t2;
    } else {
        t2 = $[11];
    }
    const nextCompany = t2;
    let t3;
    if ($[12] !== filteredCompanies.length) {
        t3 = ({
            "CompanyMatchCarousel[previousCompany]": ()=>{
                setCurrentIndex({
                    "CompanyMatchCarousel[previousCompany > setCurrentIndex()]": (prev_0)=>prev_0 === 0 ? filteredCompanies.length - 1 : prev_0 - 1
                }["CompanyMatchCarousel[previousCompany > setCurrentIndex()]"]);
            }
        })["CompanyMatchCarousel[previousCompany]"];
        $[12] = filteredCompanies.length;
        $[13] = t3;
    } else {
        t3 = $[13];
    }
    const previousCompany = t3;
    let t4;
    if ($[14] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mb-6 flex items-center gap-3.5",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                        className: "size-5 text-emerald-400"
                    }, void 0, false, {
                        fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                        lineNumber: 108,
                        columnNumber: 183
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                    lineNumber: 108,
                    columnNumber: 58
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg font-bold text-white",
                            children: "Top Company Matches"
                        }, void 0, false, {
                            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                            lineNumber: 108,
                            columnNumber: 243
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[13px] text-white/50",
                            children: "Companies where your resume has the strongest fit"
                        }, void 0, false, {
                            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                            lineNumber: 108,
                            columnNumber: 312
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                    lineNumber: 108,
                    columnNumber: 238
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
            lineNumber: 108,
            columnNumber: 10
        }, this);
        $[14] = t4;
    } else {
        t4 = $[14];
    }
    let t5;
    if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "mb-2 block text-xs font-bold uppercase tracking-wider text-white/40",
            children: "Location"
        }, void 0, false, {
            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
            lineNumber: 115,
            columnNumber: 10
        }, this);
        $[15] = t5;
    } else {
        t5 = $[15];
    }
    let t6;
    if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = ({
            "CompanyMatchCarousel[<select>.onChange]": (e)=>setLocationFilter(e.target.value)
        })["CompanyMatchCarousel[<select>.onChange]"];
        $[16] = t6;
    } else {
        t6 = $[16];
    }
    let t10;
    let t7;
    let t8;
    let t9;
    if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            className: "bg-[#1a1726]",
            value: "All",
            children: "All Locations"
        }, void 0, false, {
            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
            lineNumber: 134,
            columnNumber: 10
        }, this);
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            className: "bg-[#1a1726]",
            value: "CA",
            children: "California"
        }, void 0, false, {
            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
            lineNumber: 135,
            columnNumber: 10
        }, this);
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            className: "bg-[#1a1726]",
            value: "WA",
            children: "Washington"
        }, void 0, false, {
            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
            lineNumber: 136,
            columnNumber: 10
        }, this);
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            className: "bg-[#1a1726]",
            value: "NY",
            children: "New York"
        }, void 0, false, {
            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
            lineNumber: 137,
            columnNumber: 11
        }, this);
        $[17] = t10;
        $[18] = t7;
        $[19] = t8;
        $[20] = t9;
    } else {
        t10 = $[17];
        t7 = $[18];
        t8 = $[19];
        t9 = $[20];
    }
    let t11;
    if ($[21] !== locationFilter) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-w-50 flex-1",
            children: [
                t5,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                    value: locationFilter,
                    onChange: t6,
                    className: DARK_SELECT_CLASSES,
                    children: [
                        t7,
                        t8,
                        t9,
                        t10
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                    lineNumber: 150,
                    columnNumber: 48
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
            lineNumber: 150,
            columnNumber: 11
        }, this);
        $[21] = locationFilter;
        $[22] = t11;
    } else {
        t11 = $[22];
    }
    let t12;
    if ($[23] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "mb-2 block text-xs font-bold uppercase tracking-wider text-white/40",
            children: "Job Type"
        }, void 0, false, {
            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
            lineNumber: 158,
            columnNumber: 11
        }, this);
        $[23] = t12;
    } else {
        t12 = $[23];
    }
    let t13;
    if ($[24] === Symbol.for("react.memo_cache_sentinel")) {
        t13 = ({
            "CompanyMatchCarousel[<select>.onChange]": (e_0)=>setJobTypeFilter(e_0.target.value)
        })["CompanyMatchCarousel[<select>.onChange]"];
        $[24] = t13;
    } else {
        t13 = $[24];
    }
    let t14;
    let t15;
    let t16;
    let t17;
    if ($[25] === Symbol.for("react.memo_cache_sentinel")) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            className: "bg-[#1a1726]",
            value: "All",
            children: "All Types"
        }, void 0, false, {
            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
            lineNumber: 177,
            columnNumber: 11
        }, this);
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            className: "bg-[#1a1726]",
            value: "Full-time",
            children: "Full-time"
        }, void 0, false, {
            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
            lineNumber: 178,
            columnNumber: 11
        }, this);
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            className: "bg-[#1a1726]",
            value: "Part-time",
            children: "Part-time"
        }, void 0, false, {
            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
            lineNumber: 179,
            columnNumber: 11
        }, this);
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            className: "bg-[#1a1726]",
            value: "Contract",
            children: "Contract"
        }, void 0, false, {
            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
            lineNumber: 180,
            columnNumber: 11
        }, this);
        $[25] = t14;
        $[26] = t15;
        $[27] = t16;
        $[28] = t17;
    } else {
        t14 = $[25];
        t15 = $[26];
        t16 = $[27];
        t17 = $[28];
    }
    let t18;
    if ($[29] !== jobTypeFilter) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-w-50 flex-1",
            children: [
                t12,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                    value: jobTypeFilter,
                    onChange: t13,
                    className: DARK_SELECT_CLASSES,
                    children: [
                        t14,
                        t15,
                        t16,
                        t17
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                    lineNumber: 193,
                    columnNumber: 49
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
            lineNumber: 193,
            columnNumber: 11
        }, this);
        $[29] = jobTypeFilter;
        $[30] = t18;
    } else {
        t18 = $[30];
    }
    let t19;
    if ($[31] === Symbol.for("react.memo_cache_sentinel")) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "mb-2 block text-xs font-bold uppercase tracking-wider text-white/40",
            children: "Experience"
        }, void 0, false, {
            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
            lineNumber: 201,
            columnNumber: 11
        }, this);
        $[31] = t19;
    } else {
        t19 = $[31];
    }
    let t20;
    if ($[32] === Symbol.for("react.memo_cache_sentinel")) {
        t20 = ({
            "CompanyMatchCarousel[<select>.onChange]": (e_1)=>setExperienceLevelFilter(e_1.target.value)
        })["CompanyMatchCarousel[<select>.onChange]"];
        $[32] = t20;
    } else {
        t20 = $[32];
    }
    let t21;
    let t22;
    let t23;
    let t24;
    if ($[33] === Symbol.for("react.memo_cache_sentinel")) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            className: "bg-[#1a1726]",
            value: "All",
            children: "All Levels"
        }, void 0, false, {
            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
            lineNumber: 220,
            columnNumber: 11
        }, this);
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            className: "bg-[#1a1726]",
            value: "Mid",
            children: "Mid-Level"
        }, void 0, false, {
            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
            lineNumber: 221,
            columnNumber: 11
        }, this);
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            className: "bg-[#1a1726]",
            value: "Senior",
            children: "Senior"
        }, void 0, false, {
            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
            lineNumber: 222,
            columnNumber: 11
        }, this);
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            className: "bg-[#1a1726]",
            value: "Lead",
            children: "Lead"
        }, void 0, false, {
            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
            lineNumber: 223,
            columnNumber: 11
        }, this);
        $[33] = t21;
        $[34] = t22;
        $[35] = t23;
        $[36] = t24;
    } else {
        t21 = $[33];
        t22 = $[34];
        t23 = $[35];
        t24 = $[36];
    }
    let t25;
    if ($[37] !== experienceLevelFilter) {
        t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-w-50 flex-1",
            children: [
                t19,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                    value: experienceLevelFilter,
                    onChange: t20,
                    className: DARK_SELECT_CLASSES,
                    children: [
                        t21,
                        t22,
                        t23,
                        t24
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                    lineNumber: 236,
                    columnNumber: 49
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
            lineNumber: 236,
            columnNumber: 11
        }, this);
        $[37] = experienceLevelFilter;
        $[38] = t25;
    } else {
        t25 = $[38];
    }
    let t26;
    if ($[39] !== t11 || $[40] !== t18 || $[41] !== t25) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mb-6 flex flex-wrap gap-3 border-b border-white/[0.07] pb-6",
            children: [
                t11,
                t18,
                t25
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
            lineNumber: 244,
            columnNumber: 11
        }, this);
        $[39] = t11;
        $[40] = t18;
        $[41] = t25;
        $[42] = t26;
    } else {
        t26 = $[42];
    }
    let t27;
    if ($[43] !== activeCompany || $[44] !== currentIndex || $[45] !== filteredCompanies.length || $[46] !== nextCompany || $[47] !== previousCompany) {
        t27 = filteredCompanies.length === 0 || !activeCompany ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "py-12 text-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-white/40",
                children: "No companies match your filters"
            }, void 0, false, {
                fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                lineNumber: 254,
                columnNumber: 97
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
            lineNumber: 254,
            columnNumber: 62
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-8 flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: previousCompany,
                            className: "flex size-12 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white transition-all hover:border-fuchsia-500/30 hover:bg-fuchsia-500/10",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                className: "size-5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                                lineNumber: 254,
                                columnNumber: 457
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                            lineNumber: 254,
                            columnNumber: 236
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-white/50",
                                children: [
                                    "Company ",
                                    currentIndex + 1,
                                    " of",
                                    " ",
                                    filteredCompanies.length
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                                lineNumber: 254,
                                columnNumber: 529
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                            lineNumber: 254,
                            columnNumber: 500
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: nextCompany,
                            className: "flex size-12 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white transition-all hover:border-fuchsia-500/30 hover:bg-fuchsia-500/10",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                className: "size-5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                                lineNumber: 254,
                                columnNumber: 853
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                            lineNumber: 254,
                            columnNumber: 636
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                    lineNumber: 254,
                    columnNumber: 180
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$motion$2f$dist$2f$es$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        x: 40
                    },
                    animate: {
                        opacity: 1,
                        x: 0
                    },
                    transition: {
                        duration: 0.3
                    },
                    className: "rounded-2xl border border-fuchsia-500/15 bg-gradient-to-br from-fuchsia-500/[0.08] to-white/[0.02] p-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4 flex items-start justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "mb-1 text-2xl font-extrabold text-white",
                                            children: activeCompany.company
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                                            lineNumber: 262,
                                            columnNumber: 185
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-white/60",
                                            children: activeCompany.reason
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                                            lineNumber: 262,
                                            columnNumber: 269
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                                    lineNumber: 262,
                                    columnNumber: 180
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-right",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-1 text-4xl font-black text-fuchsia-400",
                                            children: [
                                                activeCompany.match,
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                                            lineNumber: 262,
                                            columnNumber: 366
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "rounded-md bg-fuchsia-500/15 px-2 py-0.5 text-[10px] font-black uppercase text-fuchsia-300",
                                            children: "Match Score"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                                            lineNumber: 262,
                                            columnNumber: 453
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                                    lineNumber: 262,
                                    columnNumber: 338
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                            lineNumber: 262,
                            columnNumber: 125
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-3 w-full overflow-hidden rounded-full bg-white/[0.08]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$motion$2f$dist$2f$es$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["motion"].div, {
                                    initial: {
                                        width: 0
                                    },
                                    animate: {
                                        width: `${activeCompany.match}%`
                                    },
                                    transition: {
                                        duration: 0.8
                                    },
                                    className: "h-full rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#d946ef]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                                    lineNumber: 262,
                                    columnNumber: 687
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                                lineNumber: 262,
                                columnNumber: 614
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                            lineNumber: 262,
                            columnNumber: 592
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6 grid grid-cols-2 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 text-sm text-white/70",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                            className: "size-4 text-fuchsia-400"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                                            lineNumber: 268,
                                            columnNumber: 215
                                        }, this),
                                        activeCompany.location
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                                    lineNumber: 268,
                                    columnNumber: 152
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 text-sm text-white/70",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__["Briefcase"], {
                                            className: "size-4 text-fuchsia-400"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                                            lineNumber: 268,
                                            columnNumber: 354
                                        }, this),
                                        activeCompany.jobType
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                                    lineNumber: 268,
                                    columnNumber: 291
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 text-sm text-white/70",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                            className: "size-4 text-fuchsia-400"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                                            lineNumber: 268,
                                            columnNumber: 495
                                        }, this),
                                        activeCompany.experienceLevel
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                                    lineNumber: 268,
                                    columnNumber: 432
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 text-sm text-white/70",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                                            className: "size-4 text-fuchsia-400"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                                            lineNumber: 268,
                                            columnNumber: 640
                                        }, this),
                                        activeCompany.salary
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                                    lineNumber: 268,
                                    columnNumber: 577
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2 flex items-center gap-2 text-sm text-white/70",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                            className: "size-4 text-fuchsia-400"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                                            lineNumber: 268,
                                            columnNumber: 792
                                        }, this),
                                        "Team: ",
                                        activeCompany.teamSize
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                                    lineNumber: 268,
                                    columnNumber: 718
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                            lineNumber: 268,
                            columnNumber: 107
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "mb-3 text-xs font-black uppercase text-white/40",
                                    children: "Job Requirements"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                                    lineNumber: 268,
                                    columnNumber: 884
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: activeCompany.requirements.map(_CompanyMatchCarouselActiveCompanyRequirementsMap)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                                    lineNumber: 268,
                                    columnNumber: 969
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                            lineNumber: 268,
                            columnNumber: 879
                        }, this),
                        activeCompany.top_job_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: activeCompany.top_job_url,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "mt-6 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] px-6 py-3 text-sm font-bold text-white shadow-[0px_4px_6px_0px_rgba(139,92,246,0.25)] transition-opacity hover:opacity-90",
                            children: "View Full Job Posting"
                        }, void 0, false, {
                            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                            lineNumber: 268,
                            columnNumber: 1120
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            disabled: true,
                            className: "mt-6 w-full cursor-not-allowed rounded-xl bg-white/[0.05] px-6 py-3 text-sm font-bold text-white/30",
                            children: "No Job Posting Available"
                        }, void 0, false, {
                            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                            lineNumber: 268,
                            columnNumber: 1461
                        }, this)
                    ]
                }, activeCompany.company, true, {
                    fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                    lineNumber: 254,
                    columnNumber: 903
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
            lineNumber: 254,
            columnNumber: 178
        }, this);
        $[43] = activeCompany;
        $[44] = currentIndex;
        $[45] = filteredCompanies.length;
        $[46] = nextCompany;
        $[47] = previousCompany;
        $[48] = t27;
    } else {
        t27 = $[48];
    }
    let t28;
    if ($[49] !== companies.length || $[50] !== filteredCompanies.length) {
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-4 text-center text-xs text-white/30",
            children: [
                "Showing ",
                filteredCompanies.length,
                " of ",
                companies.length,
                " ",
                "companies"
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
            lineNumber: 280,
            columnNumber: 11
        }, this);
        $[49] = companies.length;
        $[50] = filteredCompanies.length;
        $[51] = t28;
    } else {
        t28 = $[51];
    }
    let t29;
    if ($[52] !== t26 || $[53] !== t27 || $[54] !== t28) {
        t29 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-3xl border border-white/[0.07] bg-[#151221]/70 p-8 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]",
            children: [
                t4,
                t26,
                t27,
                t28
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
            lineNumber: 289,
            columnNumber: 11
        }, this);
        $[52] = t26;
        $[53] = t27;
        $[54] = t28;
        $[55] = t29;
    } else {
        t29 = $[55];
    }
    return t29;
}
_s(CompanyMatchCarousel, "xqyA1HsntqrFZLkXDPZAUrCXL3I=");
_c = CompanyMatchCarousel;
function _CompanyMatchCarouselActiveCompanyRequirementsMap(requirement, index) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex gap-2 text-sm text-white/70",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                className: "mt-0.5 size-4 shrink-0 text-emerald-400"
            }, void 0, false, {
                fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                lineNumber: 300,
                columnNumber: 72
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: requirement
            }, void 0, false, {
                fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
                lineNumber: 300,
                columnNumber: 140
            }, this)
        ]
    }, index, true, {
        fileName: "[project]/src/components/CompanyMatchCarousel.tsx",
        lineNumber: 300,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "CompanyMatchCarousel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/DashboardHeader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.mjs [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$exportReport$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/exportReport.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// components/DashboardHeader.tsx
'use client';
;
;
;
;
function DashboardHeader({ result }) {
    _s();
    const [isExporting, setIsExporting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [firstName, setFirstName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Read the stored user on the client only (avoids a hydration mismatch)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardHeader.useEffect": ()=>{
            const stored = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStoredUser"])();
            const name = stored?.full_name?.trim().split(' ')[0] ?? '';
            setFirstName(name);
        }
    }["DashboardHeader.useEffect"], []);
    const handleExport = async ()=>{
        if (isExporting) return;
        setIsExporting(true);
        try {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$exportReport$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateReportPDF"])(result, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStoredUser"])());
        } catch (err) {
            console.error('Failed to generate report PDF:', err);
        } finally{
            setIsExporting(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-[28px] font-extrabold leading-tight text-[#111827]",
                        children: [
                            "Welcome back",
                            firstName ? `, ${firstName}` : ''
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/DashboardHeader.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-[#4b5563]",
                        children: "Here is your latest resume optimization progress dashboard."
                    }, void 0, false, {
                        fileName: "[project]/src/components/DashboardHeader.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/DashboardHeader.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleExport,
                disabled: isExporting,
                className: "flex items-center gap-2 self-start rounded-[12px] border-[1.5px] border-[#e3e5eb] bg-white/72 backdrop-blur-[12px] px-5 py-3 text-sm font-medium text-[#454a54] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.05)] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60",
                children: [
                    isExporting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                        className: "size-[18px] animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/src/components/DashboardHeader.tsx",
                        lineNumber: 50,
                        columnNumber: 24
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                        className: "size-[18px]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/DashboardHeader.tsx",
                        lineNumber: 50,
                        columnNumber: 75
                    }, this),
                    isExporting ? 'Exporting…' : 'Export PDF'
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/DashboardHeader.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/DashboardHeader.tsx",
        lineNumber: 37,
        columnNumber: 10
    }, this);
}
_s(DashboardHeader, "499GSMZClMu3/R0eIDvAuIBSsA4=");
_c = DashboardHeader;
var _c;
__turbopack_context__.k.register(_c, "DashboardHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/FormattingReadability.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FormattingReadability
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// Represents a single grammar/style issue with its category and description
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
'use client';
;
;
function FormattingReadability(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(6);
    if ($[0] !== "a0dad7a2c6392db4275269493e9021ed3787862cdb5cff38f4bc7c8803204e83") {
        for(let $i = 0; $i < 6; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "a0dad7a2c6392db4275269493e9021ed3787862cdb5cff38f4bc7c8803204e83";
    }
    const { grammarIssues } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mb-6 flex items-center gap-3.5",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex size-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-lg font-bold text-amber-400",
                        children: "T"
                    }, void 0, false, {
                        fileName: "[project]/src/components/FormattingReadability.tsx",
                        lineNumber: 27,
                        columnNumber: 179
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/FormattingReadability.tsx",
                    lineNumber: 27,
                    columnNumber: 58
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-bold text-white",
                            children: "Formatting & Readability"
                        }, void 0, false, {
                            fileName: "[project]/src/components/FormattingReadability.tsx",
                            lineNumber: 27,
                            columnNumber: 249
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[13px] text-white/50",
                            children: "Checking for visual flow and linguistic clarity"
                        }, void 0, false, {
                            fileName: "[project]/src/components/FormattingReadability.tsx",
                            lineNumber: 27,
                            columnNumber: 327
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/FormattingReadability.tsx",
                    lineNumber: 27,
                    columnNumber: 244
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/FormattingReadability.tsx",
            lineNumber: 27,
            columnNumber: 10
        }, this);
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] !== grammarIssues) {
        t2 = grammarIssues.map(_FormattingReadabilityGrammarIssuesMap);
        $[2] = grammarIssues;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-3xl border border-white/[0.07] bg-[#151221]/70 p-6 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]",
            children: [
                t1,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-3",
                    children: t2
                }, void 0, false, {
                    fileName: "[project]/src/components/FormattingReadability.tsx",
                    lineNumber: 42,
                    columnNumber: 155
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/FormattingReadability.tsx",
            lineNumber: 42,
            columnNumber: 10
        }, this);
        $[4] = t2;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    return t3;
}
_c = FormattingReadability;
function _FormattingReadabilityGrammarIssuesMap(issue) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "group flex items-center gap-4 rounded-xl border border-white/[0.05] bg-white/[0.03] px-4 py-3 transition-colors hover:border-fuchsia-500/20 hover:bg-fuchsia-500/[0.06]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "w-24 shrink-0 text-xs font-bold uppercase tracking-widest text-white/40 transition-colors group-hover:text-fuchsia-300",
                children: issue.type
            }, void 0, false, {
                fileName: "[project]/src/components/FormattingReadability.tsx",
                lineNumber: 51,
                columnNumber: 212
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm font-medium leading-snug text-white/80",
                children: issue.text
            }, void 0, false, {
                fileName: "[project]/src/components/FormattingReadability.tsx",
                lineNumber: 51,
                columnNumber: 368
            }, this)
        ]
    }, issue.text, true, {
        fileName: "[project]/src/components/FormattingReadability.tsx",
        lineNumber: 51,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "FormattingReadability");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/KeyStrengths.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>KeyStrengths
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
'use client';
;
;
function KeyStrengths(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(6);
    if ($[0] !== "0d0a927926b8592f7e8841fcd5eade79815187d09ffecd69f5e6189c45d2216a") {
        for(let $i = 0; $i < 6; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "0d0a927926b8592f7e8841fcd5eade79815187d09ffecd69f5e6189c45d2216a";
    }
    const { strengths } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mb-4 flex items-center gap-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "size-5 text-emerald-400",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2.5,
                        d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    }, void 0, false, {
                        fileName: "[project]/src/components/KeyStrengths.tsx",
                        lineNumber: 22,
                        columnNumber: 151
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/KeyStrengths.tsx",
                    lineNumber: 22,
                    columnNumber: 56
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm font-extrabold uppercase tracking-widest text-white/50",
                    children: "Key Strengths"
                }, void 0, false, {
                    fileName: "[project]/src/components/KeyStrengths.tsx",
                    lineNumber: 22,
                    columnNumber: 278
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/KeyStrengths.tsx",
            lineNumber: 22,
            columnNumber: 10
        }, this);
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] !== strengths) {
        t2 = strengths.map(_KeyStrengthsStrengthsMap);
        $[2] = strengths;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-3xl border border-white/[0.07] bg-[#151221]/70 p-5 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]",
            children: [
                t1,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    className: "flex flex-col gap-3",
                    children: t2
                }, void 0, false, {
                    fileName: "[project]/src/components/KeyStrengths.tsx",
                    lineNumber: 37,
                    columnNumber: 155
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/KeyStrengths.tsx",
            lineNumber: 37,
            columnNumber: 10
        }, this);
        $[4] = t2;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    return t3;
}
_c = KeyStrengths;
function _KeyStrengthsStrengthsMap(s) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        className: "flex items-start gap-2 leading-snug",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "mt-1.5 size-2 shrink-0 rounded-full bg-emerald-400"
            }, void 0, false, {
                fileName: "[project]/src/components/KeyStrengths.tsx",
                lineNumber: 46,
                columnNumber: 70
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm font-medium text-white/80",
                children: s
            }, void 0, false, {
                fileName: "[project]/src/components/KeyStrengths.tsx",
                lineNumber: 46,
                columnNumber: 141
            }, this)
        ]
    }, s, true, {
        fileName: "[project]/src/components/KeyStrengths.tsx",
        lineNumber: 46,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "KeyStrengths");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/KeywordSkillOptimization.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>KeywordSkillOptimization
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// Represents a single skill, whether it's missing from the resume, and a recommendation
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
'use client';
;
;
function KeywordSkillOptimization(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(6);
    if ($[0] !== "3edcb44caadc010da3aa8dd3ee385a1cc9401ec0b37c39d481802eaefd62d39d") {
        for(let $i = 0; $i < 6; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "3edcb44caadc010da3aa8dd3ee385a1cc9401ec0b37c39d481802eaefd62d39d";
    }
    const { skillGaps } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mb-6 flex items-center gap-3.5",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex size-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "size-5 text-violet-400",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "12",
                                cy: "12",
                                r: "3",
                                strokeWidth: 2
                            }, void 0, false, {
                                fileName: "[project]/src/components/KeywordSkillOptimization.tsx",
                                lineNumber: 28,
                                columnNumber: 275
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M12 2v2m0 16v2M2 12h2m16 0h2m-3.22-6.78-1.42 1.42M5.64 18.36l-1.42 1.42M18.36 18.36l-1.42-1.42M5.64 5.64 4.22 4.22"
                            }, void 0, false, {
                                fileName: "[project]/src/components/KeywordSkillOptimization.tsx",
                                lineNumber: 28,
                                columnNumber: 323
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/KeywordSkillOptimization.tsx",
                        lineNumber: 28,
                        columnNumber: 181
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/KeywordSkillOptimization.tsx",
                    lineNumber: 28,
                    columnNumber: 58
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-bold text-white",
                            children: "Keyword & Skill Optimization"
                        }, void 0, false, {
                            fileName: "[project]/src/components/KeywordSkillOptimization.tsx",
                            lineNumber: 28,
                            columnNumber: 528
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[13px] text-white/50",
                            children: "Industry-standard requirements for your target role level"
                        }, void 0, false, {
                            fileName: "[project]/src/components/KeywordSkillOptimization.tsx",
                            lineNumber: 28,
                            columnNumber: 610
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/KeywordSkillOptimization.tsx",
                    lineNumber: 28,
                    columnNumber: 523
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/KeywordSkillOptimization.tsx",
            lineNumber: 28,
            columnNumber: 10
        }, this);
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] !== skillGaps) {
        t2 = skillGaps.map(_KeywordSkillOptimizationSkillGapsMap);
        $[2] = skillGaps;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-3xl border border-white/[0.07] bg-[#151221]/70 p-6 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]",
            children: [
                t1,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 gap-3",
                    children: t2
                }, void 0, false, {
                    fileName: "[project]/src/components/KeywordSkillOptimization.tsx",
                    lineNumber: 43,
                    columnNumber: 155
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/KeywordSkillOptimization.tsx",
            lineNumber: 43,
            columnNumber: 10
        }, this);
        $[4] = t2;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    return t3;
}
_c = KeywordSkillOptimization;
function _KeywordSkillOptimizationSkillGapsMap(item) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex flex-col gap-2 rounded-xl border p-4 ${item.missing ? "border-amber-500/20 bg-amber-500/[0.06]" : "border-emerald-500/20 bg-emerald-500/[0.06]"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-bold text-white",
                        children: item.skill
                    }, void 0, false, {
                        fileName: "[project]/src/components/KeywordSkillOptimization.tsx",
                        lineNumber: 52,
                        columnNumber: 247
                    }, this),
                    item.missing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "rounded bg-amber-500/15 px-2 py-0.5 text-xs font-bold tracking-wide text-amber-400",
                        children: "OPTIONAL"
                    }, void 0, false, {
                        fileName: "[project]/src/components/KeywordSkillOptimization.tsx",
                        lineNumber: 52,
                        columnNumber: 321
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "rounded bg-emerald-500/15 px-2 py-0.5 text-xs font-bold tracking-wide text-emerald-400",
                        children: "REQUIRED"
                    }, void 0, false, {
                        fileName: "[project]/src/components/KeywordSkillOptimization.tsx",
                        lineNumber: 52,
                        columnNumber: 440
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/KeywordSkillOptimization.tsx",
                lineNumber: 52,
                columnNumber: 196
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm leading-snug text-white/50",
                children: item.recommendation
            }, void 0, false, {
                fileName: "[project]/src/components/KeywordSkillOptimization.tsx",
                lineNumber: 52,
                columnNumber: 567
            }, this)
        ]
    }, item.skill, true, {
        fileName: "[project]/src/components/KeywordSkillOptimization.tsx",
        lineNumber: 52,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "KeywordSkillOptimization");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/SmartSuggestions.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SmartSuggestions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
'use client';
;
;
function SmartSuggestions(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(6);
    if ($[0] !== "ac223f1559a6d2290ea501b7f512549b8863392a7492e66be25714f917a0b19f") {
        for(let $i = 0; $i < 6; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "ac223f1559a6d2290ea501b7f512549b8863392a7492e66be25714f917a0b19f";
    }
    const { improvements } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mb-4 flex items-center gap-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "size-5 text-amber-400",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m1.343-5.657-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    }, void 0, false, {
                        fileName: "[project]/src/components/SmartSuggestions.tsx",
                        lineNumber: 22,
                        columnNumber: 149
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/SmartSuggestions.tsx",
                    lineNumber: 22,
                    columnNumber: 56
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm font-extrabold uppercase tracking-widest text-white/50",
                    children: "Smart Suggestions"
                }, void 0, false, {
                    fileName: "[project]/src/components/SmartSuggestions.tsx",
                    lineNumber: 22,
                    columnNumber: 435
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/SmartSuggestions.tsx",
            lineNumber: 22,
            columnNumber: 10
        }, this);
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] !== improvements) {
        t2 = improvements.map(_SmartSuggestionsImprovementsMap);
        $[2] = improvements;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-3xl border border-white/[0.07] bg-[#151221]/70 p-5 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]",
            children: [
                t1,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    className: "flex flex-col gap-3",
                    children: t2
                }, void 0, false, {
                    fileName: "[project]/src/components/SmartSuggestions.tsx",
                    lineNumber: 37,
                    columnNumber: 155
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/SmartSuggestions.tsx",
            lineNumber: 37,
            columnNumber: 10
        }, this);
        $[4] = t2;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    return t3;
}
_c = SmartSuggestions;
function _SmartSuggestionsImprovementsMap(s) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        className: "flex items-start gap-2 leading-snug",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "mt-1.5 size-2 shrink-0 rounded-full bg-amber-400"
            }, void 0, false, {
                fileName: "[project]/src/components/SmartSuggestions.tsx",
                lineNumber: 46,
                columnNumber: 70
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm font-medium text-white/80",
                children: s
            }, void 0, false, {
                fileName: "[project]/src/components/SmartSuggestions.tsx",
                lineNumber: 46,
                columnNumber: 139
            }, this)
        ]
    }, s, true, {
        fileName: "[project]/src/components/SmartSuggestions.tsx",
        lineNumber: 46,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "SmartSuggestions");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/exportReport.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateReportPDF",
    ()=>generateReportPDF
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jspdf/dist/jspdf.es.min.js [app-client] (ecmascript)");
;
// ─────────────────────────────────────────────
// Layout & Color System (A4 in points)
// ─────────────────────────────────────────────
const MARGIN = 40;
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const BOTTOM_LIMIT = PAGE_HEIGHT - 50;
const COLOR = {
    primary: [
        79,
        70,
        229
    ],
    primaryDark: [
        49,
        46,
        129
    ],
    slate900: [
        15,
        23,
        42
    ],
    slate700: [
        51,
        65,
        85
    ],
    slate500: [
        100,
        116,
        139
    ],
    slate200: [
        226,
        232,
        240
    ],
    slate50: [
        248,
        250,
        252
    ],
    emerald: [
        16,
        185,
        129
    ],
    amber: [
        245,
        158,
        11
    ],
    rose: [
        244,
        63,
        94
    ],
    white: [
        255,
        255,
        255
    ]
};
function generateReportPDF(result, user, customFileName) {
    const doc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsPDF"]({
        unit: 'pt',
        format: 'a4'
    });
    let y = MARGIN;
    // ── Extract User Information safely across DB & Auth structures ──
    const rawName = user?.full_name?.trim() || user?.user_metadata?.full_name?.trim() || user?.user_metadata?.name?.trim() || '';
    const candidateName = rawName || (user?.email ? user.email.split('@')[0] : 'Valued Candidate');
    const candidateEmail = user?.email || 'N/A';
    // ── Format Dynamic Filename: name-aura-resume_report.pdf ───────
    const nameSlug = rawName ? rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : user?.email ? user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'user';
    const fileName = customFileName || `${nameSlug}-aura-resume_report.pdf`;
    // ── Helper: Page Overflow Guard ───────────────────────
    const ensureSpace = (needed)=>{
        if (y + needed > BOTTOM_LIMIT) {
            doc.addPage();
            y = MARGIN + 20;
        }
    };
    // ── Helper: Section Heading with Accent Bar ───────────
    const renderSectionHeader = (title)=>{
        ensureSpace(35);
        doc.setFillColor(...COLOR.primary);
        doc.rect(MARGIN, y, 4, 14, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(...COLOR.slate900);
        doc.text(title.toUpperCase(), MARGIN + 12, y + 11);
        y += 24;
    };
    // ── 1. Top Decorative Brand Banner ────────────────────
    doc.setFillColor(...COLOR.primaryDark);
    doc.rect(0, 0, PAGE_WIDTH, 8, 'F');
    // ── 2. Report Header Block ────────────────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(...COLOR.primaryDark);
    doc.text('AURA RESUME ANALYSIS', MARGIN, y + 20);
    // User details block (Top Right)
    const reportDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...COLOR.slate900);
    doc.text(candidateName, PAGE_WIDTH - MARGIN, y + 8, {
        align: 'right'
    });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLOR.slate500);
    doc.text(candidateEmail, PAGE_WIDTH - MARGIN, y + 20, {
        align: 'right'
    });
    doc.text(`Generated: ${reportDate}`, PAGE_WIDTH - MARGIN, y + 31, {
        align: 'right'
    });
    y += 48;
    // Divider
    doc.setDrawColor(...COLOR.slate200);
    doc.setLineWidth(0.75);
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
    y += 18;
    // ── 3. Executive ATS Score Summary Card ───────────────
    ensureSpace(90);
    const cardHeight = 82;
    doc.setFillColor(...COLOR.slate50);
    doc.setDrawColor(...COLOR.slate200);
    doc.roundedRect(MARGIN, y, CONTENT_WIDTH, cardHeight, 6, 6, 'FD');
    const score = result.ats_score ?? 0;
    const scoreColor = score >= 80 ? COLOR.emerald : score >= 60 ? COLOR.amber : COLOR.rose;
    doc.setFillColor(...scoreColor);
    doc.roundedRect(MARGIN + 12, y + 12, 70, 58, 4, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(...COLOR.white);
    doc.text(`${score}%`, MARGIN + 47, y + 42, {
        align: 'center'
    });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('ATS SCORE', MARGIN + 47, y + 57, {
        align: 'center'
    });
    let sectionX = MARGIN + 100;
    let sectionY = y + 22;
    const maxSectionsPerRow = 3;
    const colWidth = (CONTENT_WIDTH - 110) / maxSectionsPerRow;
    result.sections.forEach((sec, idx)=>{
        if (idx > 0 && idx % maxSectionsPerRow === 0) {
            sectionX = MARGIN + 100;
            sectionY += 28;
        }
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...COLOR.slate500);
        doc.text(sec.name, sectionX, sectionY);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(...COLOR.slate900);
        doc.text(`${sec.value}%`, sectionX, sectionY + 13);
        sectionX += colWidth;
    });
    y += cardHeight + 20;
    // ── 4. Key Strengths ──────────────────────────────────
    renderSectionHeader('Key Strengths');
    if (!result.strengths || result.strengths.length === 0) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9.5);
        doc.setTextColor(...COLOR.slate500);
        doc.text('No strengths identified in the current pass.', MARGIN, y);
        y += 16;
    } else {
        result.strengths.forEach((strength)=>{
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9.5);
            doc.setTextColor(...COLOR.slate700);
            const lines = doc.splitTextToSize(strength, CONTENT_WIDTH - 20);
            ensureSpace(lines.length * 13 + 4);
            doc.setFillColor(...COLOR.emerald);
            doc.circle(MARGIN + 4, y - 3, 2.5, 'F');
            doc.text(lines, MARGIN + 16, y);
            y += lines.length * 13 + 4;
        });
    }
    y += 10;
    // ── 5. Smart Suggestions ──────────────────────────────
    renderSectionHeader('Smart Suggestions');
    if (!result.improvements || result.improvements.length === 0) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9.5);
        doc.setTextColor(...COLOR.slate500);
        doc.text('No critical improvements needed.', MARGIN, y);
        y += 16;
    } else {
        result.improvements.forEach((item)=>{
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9.5);
            doc.setTextColor(...COLOR.slate700);
            const lines = doc.splitTextToSize(item, CONTENT_WIDTH - 20);
            ensureSpace(lines.length * 13 + 4);
            doc.setFillColor(...COLOR.amber);
            doc.circle(MARGIN + 4, y - 3, 2.5, 'F');
            doc.text(lines, MARGIN + 16, y);
            y += lines.length * 13 + 4;
        });
    }
    y += 10;
    // ── 6. Skill & Keyword Gaps ───────────────────────────
    if (result.skill_gaps && result.skill_gaps.length > 0) {
        renderSectionHeader('Skill & Keyword Gap Analysis');
        result.skill_gaps.forEach((gap)=>{
            const isMissing = gap.missing;
            const statusLabel = isMissing ? 'OPTIONAL / MISSING' : 'REQUIRED — MET';
            const badgeBg = isMissing ? COLOR.amber : COLOR.emerald;
            const recLines = doc.splitTextToSize(gap.recommendation, CONTENT_WIDTH - 12);
            ensureSpace(recLines.length * 12 + 22);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(...COLOR.slate900);
            doc.text(gap.skill, MARGIN, y);
            const skillNameWidth = doc.getTextWidth(gap.skill);
            doc.setFillColor(...badgeBg);
            doc.roundedRect(MARGIN + skillNameWidth + 8, y - 8, 80, 11, 2, 2, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(6.5);
            doc.setTextColor(...COLOR.white);
            doc.text(statusLabel, MARGIN + skillNameWidth + 48, y - 1, {
                align: 'center'
            });
            y += 13;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(...COLOR.slate500);
            doc.text(recLines, MARGIN, y);
            y += recLines.length * 12 + 6;
        });
        y += 10;
    }
    // ── 7. Top Job Matches ────────────────────────────────
    if (result.top_jobs && result.top_jobs.length > 0) {
        renderSectionHeader('Top Matched Opportunities');
        result.top_jobs.slice(0, 5).forEach((job)=>{
            ensureSpace(28);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9.5);
            doc.setTextColor(...COLOR.slate900);
            doc.text(job.title, MARGIN, y);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(...COLOR.primary);
            doc.text(`${job.total_score}% Match`, PAGE_WIDTH - MARGIN, y, {
                align: 'right'
            });
            y += 11;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(...COLOR.slate500);
            doc.text(`${job.company} • ${job.location}`, MARGIN, y);
            y += 16;
        });
    }
    // ── 8. Global Dynamic Header & Footer Pass ────────────
    const totalPages = doc.getNumberOfPages();
    for(let i = 1; i <= totalPages; i++){
        doc.setPage(i);
        doc.setDrawColor(...COLOR.slate200);
        doc.setLineWidth(0.5);
        doc.line(MARGIN, PAGE_HEIGHT - 35, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 35);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...COLOR.slate500);
        doc.text('Aura AI Resume Analyzer — Confidential Report', MARGIN, PAGE_HEIGHT - 22);
        doc.text(`Page ${i} of ${totalPages}`, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 22, {
            align: 'right'
        });
    }
    doc.save(fileName);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_110btvb._.js.map