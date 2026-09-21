(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/ConditionalLayout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConditionalLayout",
    ()=>ConditionalLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NavBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/NavBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Footer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
// Routes that use the authenticated (logged-in) Navbar
const AUTHENTICATED_ROUTES = [
    '/dashboard',
    '/profile',
    '/analysis-history',
    '/settings'
];
// "from" values on legal pages that mean the user arrived from an authenticated route.
const AUTHENTICATED_FROM_VALUES = [
    'dashboard',
    'profile',
    'analysis-history',
    'settings'
];
// Legal pages that have no fixed auth state of their own and instead
// borrow it from the "from" query param.
const LEGAL_ROUTES = [
    '/privacy',
    '/terms-of-service'
];
// Legal pages opened from these pages keep the Navbar hidden (they have none)
const NO_NAVBAR_FROM_VALUES = [
    'signup',
    'signin'
];
function ConditionalLayout(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(28);
    if ($[0] !== "f6db6f1a54ac9c3ce5b710611873ef4716cfbbe2090e6d031f8b9fa52ad1a33c") {
        for(let $i = 0; $i < 28; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "f6db6f1a54ac9c3ce5b710611873ef4716cfbbe2090e6d031f8b9fa52ad1a33c";
    }
    const { children } = t0;
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const from = searchParams.get("from");
    const [authed, setAuthed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t1;
    if ($[1] !== setAuthed) {
        t1 = ({
            "ConditionalLayout[useEffect()]": ()=>{
                setAuthed((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAuthenticated"])());
            }
        })["ConditionalLayout[useEffect()]"];
        $[1] = setAuthed;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] !== pathname) {
        t2 = [
            pathname
        ];
        $[3] = pathname;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t1, t2);
    let t3;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = [
            "/signup",
            "/signin"
        ];
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    const hideNavFooter = t3.includes(pathname);
    let t4;
    if ($[6] !== pathname) {
        t4 = LEGAL_ROUTES.includes(pathname);
        $[6] = pathname;
        $[7] = t4;
    } else {
        t4 = $[7];
    }
    const isLegalRoute = t4;
    const isLegalFromAuth = isLegalRoute && !!from && AUTHENTICATED_FROM_VALUES.includes(from);
    const hideNavOnly = isLegalRoute && !!from && NO_NAVBAR_FROM_VALUES.includes(from);
    let t5;
    if ($[8] !== authed || $[9] !== isLegalFromAuth || $[10] !== pathname) {
        t5 = authed || AUTHENTICATED_ROUTES.some({
            "ConditionalLayout[AUTHENTICATED_ROUTES.some()]": (route)=>pathname.startsWith(route)
        }["ConditionalLayout[AUTHENTICATED_ROUTES.some()]"]) || isLegalFromAuth;
        $[8] = authed;
        $[9] = isLegalFromAuth;
        $[10] = pathname;
        $[11] = t5;
    } else {
        t5 = $[11];
    }
    const isAuthenticated = t5;
    let t6;
    if ($[12] !== router || $[13] !== setAuthed) {
        t6 = ({
            "ConditionalLayout[handleLogout]": ()=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearSession"])();
                setAuthed(false);
                router.push("/signin");
            }
        })["ConditionalLayout[handleLogout]"];
        $[12] = router;
        $[13] = setAuthed;
        $[14] = t6;
    } else {
        t6 = $[14];
    }
    const handleLogout = t6;
    let t7;
    if ($[15] !== handleLogout || $[16] !== hideNavFooter || $[17] !== hideNavOnly || $[18] !== isAuthenticated) {
        t7 = !hideNavFooter && !hideNavOnly && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NavBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Navbar"], {
            isAuthenticated: isAuthenticated,
            onLogout: handleLogout
        }, void 0, false, {
            fileName: "[project]/src/components/ConditionalLayout.tsx",
            lineNumber: 110,
            columnNumber: 44
        }, this);
        $[15] = handleLogout;
        $[16] = hideNavFooter;
        $[17] = hideNavOnly;
        $[18] = isAuthenticated;
        $[19] = t7;
    } else {
        t7 = $[19];
    }
    let t8;
    if ($[20] !== children) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "min-h-screen",
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/ConditionalLayout.tsx",
            lineNumber: 121,
            columnNumber: 10
        }, this);
        $[20] = children;
        $[21] = t8;
    } else {
        t8 = $[21];
    }
    let t9;
    if ($[22] !== hideNavFooter) {
        t9 = !hideNavFooter && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Footer"], {}, void 0, false, {
            fileName: "[project]/src/components/ConditionalLayout.tsx",
            lineNumber: 129,
            columnNumber: 28
        }, this);
        $[22] = hideNavFooter;
        $[23] = t9;
    } else {
        t9 = $[23];
    }
    let t10;
    if ($[24] !== t7 || $[25] !== t8 || $[26] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                t7,
                t8,
                t9
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ConditionalLayout.tsx",
            lineNumber: 137,
            columnNumber: 11
        }, this);
        $[24] = t7;
        $[25] = t8;
        $[26] = t9;
        $[27] = t10;
    } else {
        t10 = $[27];
    }
    return t10;
}
_s(ConditionalLayout, "v7zNL/zXSlyN6AZdX4Fqim1CwGI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = ConditionalLayout;
var _c;
__turbopack_context__.k.register(_c, "ConditionalLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Footer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Footer",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// components/Footer.tsx
'use client';
;
;
;
const Footer = ()=>{
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(11);
    if ($[0] !== "fb594fe0bd1b0a8f49209dc07cba6e17ecf493398df86ed9d1a32980d49b5cc5") {
        for(let $i = 0; $i < 11; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "fb594fe0bd1b0a8f49209dc07cba6e17ecf493398df86ed9d1a32980d49b5cc5";
    }
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = {
            "/dashboard": "dashboard",
            "/signin": "signin",
            "/signup": "signup",
            "/upload": "upload"
        };
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    const fromMap = t0;
    const from = fromMap[pathname];
    const privacyHref = from ? `/privacy?from=${from}` : "/privacy";
    const termsHref = from ? `/terms-of-service?from=${from}` : "/terms-of-service";
    let t1;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-px w-full",
            style: {
                backgroundImage: "linear-gradient(90deg, rgba(139, 92, 246, 0) 0%, rgba(139, 92, 246, 0.188) 30%, rgba(6, 182, 212, 0.188) 70%, rgba(6, 182, 212, 0) 100%)"
            }
        }, void 0, false, {
            fileName: "[project]/src/components/Footer.tsx",
            lineNumber: 36,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "font-normal text-[#9ca3af]",
            children: "© 2026 Aura. All rights reserved."
        }, void 0, false, {
            fileName: "[project]/src/components/Footer.tsx",
            lineNumber: 45,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] !== privacyHref) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: privacyHref,
            className: "transition-colors hover:text-[#111827]",
            children: "Privacy Policy"
        }, void 0, false, {
            fileName: "[project]/src/components/Footer.tsx",
            lineNumber: 52,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[4] = privacyHref;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    let t4;
    if ($[6] !== termsHref) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: termsHref,
            className: "transition-colors hover:text-[#111827]",
            children: "Terms of Service"
        }, void 0, false, {
            fileName: "[project]/src/components/Footer.tsx",
            lineNumber: 60,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[6] = termsHref;
        $[7] = t4;
    } else {
        t4 = $[7];
    }
    let t5;
    if ($[8] !== t3 || $[9] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
            className: "w-full font-['DM_Sans',_sans-serif]",
            children: [
                t1,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center gap-4 bg-white/[0.38] px-6 py-6 text-[13px] sm:px-10 md:flex-row md:items-center md:justify-between md:gap-0 md:px-20",
                    children: [
                        t2,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-8 font-medium text-[#4b5563]",
                            children: [
                                t3,
                                t4
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Footer.tsx",
                            lineNumber: 68,
                            columnNumber: 236
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Footer.tsx",
                    lineNumber: 68,
                    columnNumber: 70
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Footer.tsx",
            lineNumber: 68,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[8] = t3;
        $[9] = t4;
        $[10] = t5;
    } else {
        t5 = $[10];
    }
    return t5;
};
_s(Footer, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = Footer;
var _c;
__turbopack_context__.k.register(_c, "Footer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/NavBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Navbar",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$motion$2f$dist$2f$es$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/motion/dist/es/react.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$motion$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/motion/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/brain.mjs [app-client] (ecmascript) <export default as Brain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.mjs [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// components/Navbar.tsx
'use client';
;
;
;
;
;
;
;
const AUTH_NAV_LINKS = [
    {
        label: 'Dashboard',
        href: '/dashboard'
    },
    // TEMPORARY: old upload page. Remove this line once the backend is fixed.
    {
        label: 'Upload',
        href: '/upload'
    },
    {
        label: 'History',
        href: '/analysis-history'
    },
    {
        label: 'AI Mode',
        href: '/ai-mode'
    },
    {
        label: 'Settings',
        href: '/settings'
    }
];
const PUBLIC_NAV_LINKS = [
    {
        label: 'Home',
        href: '/'
    },
    {
        label: 'Features',
        href: '/#features'
    },
    {
        label: 'FAQ',
        href: '/#faq'
    },
    {
        label: 'Contact Us',
        href: '/#contact'
    }
];
// Sections of the home page (element ids) that the navbar highlights while you scroll.
// Order must match their order on the page, top to bottom.
const HOME_SECTION_IDS = [
    'features',
    'faq',
    'contact'
];
// Pages that have their own full-screen layout (per the Figma design) and
// must NOT show the top navbar. Add any other auth-flow routes here.
const NAVBAR_HIDDEN_ROUTES = [
    '/signin',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/oauth-callback'
];
const Navbar = (t0)=>{
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(31);
    if ($[0] !== "fb8818ec7f14420e8ddb7e09f8775dbb4d8b947ab5da3f41feea442c283560a0") {
        for(let $i = 0; $i < 31; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "fb8818ec7f14420e8ddb7e09f8775dbb4d8b947ab5da3f41feea442c283560a0";
    }
    const { isAuthenticated: isAuthenticatedProp, onLogout } = t0;
    const [isDropdownOpen, setIsDropdownOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const [userName, setUserName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("Your Account");
    const [userEmail, setUserEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [hasSession, setHasSession] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeSection, setActiveSection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("home");
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = ()=>{
            const stored = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStoredUser"])();
            setHasSession(!!stored);
            if (stored) {
                setUserName(stored.full_name || stored.email || "Your Account");
                setUserEmail(stored.email || "");
            } else {
                setUserName("Your Account");
                setUserEmail("");
            }
        };
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] !== isAuthenticatedProp || $[3] !== pathname) {
        t2 = [
            pathname,
            isAuthenticatedProp
        ];
        $[2] = isAuthenticatedProp;
        $[3] = pathname;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t1, t2);
    const isAuthenticated = isAuthenticatedProp ?? hasSession === true;
    const sessionReady = isAuthenticatedProp !== undefined || hasSession !== null;
    let t3;
    if ($[5] !== userName) {
        t3 = userName.split(" ").filter(Boolean).map(_temp).join("").toUpperCase().slice(0, 2);
        $[5] = userName;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    const initials = t3;
    let t4;
    let t5;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = ()=>{
            const handleClickOutside = (event)=>{
                if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                    setIsDropdownOpen(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return ()=>document.removeEventListener("mousedown", handleClickOutside);
        };
        t5 = [];
        $[7] = t4;
        $[8] = t5;
    } else {
        t4 = $[7];
        t5 = $[8];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t4, t5);
    let t6;
    let t7;
    if ($[9] !== pathname) {
        t6 = ()=>{
            if (pathname !== "/") {
                return;
            }
            let frame = 0;
            const update = ()=>{
                const threshold = Math.max(160, window.innerHeight * 0.35);
                let current = "home";
                for (const id of HOME_SECTION_IDS){
                    const el = document.getElementById(id);
                    if (el && el.getBoundingClientRect().top <= threshold) {
                        current = id;
                    }
                }
                const atBottom = window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
                if (atBottom) {
                    current = HOME_SECTION_IDS[HOME_SECTION_IDS.length - 1];
                }
                setActiveSection(current);
            };
            const onScroll = ()=>{
                cancelAnimationFrame(frame);
                frame = requestAnimationFrame(update);
            };
            update();
            window.addEventListener("scroll", onScroll, {
                passive: true
            });
            window.addEventListener("resize", onScroll);
            return ()=>{
                cancelAnimationFrame(frame);
                window.removeEventListener("scroll", onScroll);
                window.removeEventListener("resize", onScroll);
            };
        };
        t7 = [
            pathname
        ];
        $[9] = pathname;
        $[10] = t6;
        $[11] = t7;
    } else {
        t6 = $[10];
        t7 = $[11];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t6, t7);
    const hideNavbar = !!pathname && NAVBAR_HIDDEN_ROUTES.some((route)=>pathname === route || pathname.startsWith(`${route}/`));
    if (hideNavbar) {
        return null;
    }
    const navLinks = isAuthenticated ? AUTH_NAV_LINKS : PUBLIC_NAV_LINKS;
    let t8;
    if ($[12] !== activeSection || $[13] !== pathname) {
        t8 = (href)=>{
            if (pathname === "/") {
                if (href === "/") {
                    return activeSection === "home";
                }
                if (href.startsWith("/#")) {
                    return activeSection === href.slice(2);
                }
            }
            return pathname === href;
        };
        $[12] = activeSection;
        $[13] = pathname;
        $[14] = t8;
    } else {
        t8 = $[14];
    }
    const isLinkActive = t8;
    let t9;
    if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/",
            className: "flex items-center gap-2.5 shrink-0",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-7 h-7 bg-gradient-to-r from-[#7c3aed] via-[#a78bfa] to-[#06b6d4] rounded-lg flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__["Brain"], {
                        className: "text-white w-4 h-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/NavBar.tsx",
                        lineNumber: 204,
                        columnNumber: 200
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/NavBar.tsx",
                    lineNumber: 204,
                    columnNumber: 72
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-[22px] font-bold tracking-tight text-[#111827]",
                    children: "Aura"
                }, void 0, false, {
                    fileName: "[project]/src/components/NavBar.tsx",
                    lineNumber: 204,
                    columnNumber: 246
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/NavBar.tsx",
            lineNumber: 204,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[15] = t9;
    } else {
        t9 = $[15];
    }
    let t10;
    if ($[16] !== isLinkActive || $[17] !== navLinks || $[18] !== sessionReady) {
        t10 = sessionReady && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-sm",
            children: navLinks.map((link)=>{
                const isActive = isLinkActive(link.href);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: link.href,
                    className: isActive ? "font-semibold text-[#111827]" : "font-medium text-[#4b5563] hover:text-[#111827] transition-colors",
                    children: link.label
                }, link.href, false, {
                    fileName: "[project]/src/components/NavBar.tsx",
                    lineNumber: 213,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            })
        }, void 0, false, {
            fileName: "[project]/src/components/NavBar.tsx",
            lineNumber: 211,
            columnNumber: 27
        }, ("TURBOPACK compile-time value", void 0));
        $[16] = isLinkActive;
        $[17] = navLinks;
        $[18] = sessionReady;
        $[19] = t10;
    } else {
        t10 = $[19];
    }
    let t11;
    if ($[20] !== initials || $[21] !== isAuthenticated || $[22] !== isDropdownOpen || $[23] !== onLogout || $[24] !== sessionReady || $[25] !== userEmail || $[26] !== userName) {
        t11 = !sessionReady ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-10 w-40 shrink-0",
            "aria-hidden": "true"
        }, void 0, false, {
            fileName: "[project]/src/components/NavBar.tsx",
            lineNumber: 224,
            columnNumber: 27
        }, ("TURBOPACK compile-time value", void 0)) : isAuthenticated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative shrink-0",
            ref: dropdownRef,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setIsDropdownOpen(!isDropdownOpen),
                    className: "flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-black/[0.03] transition-colors",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-8 h-8 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded-full flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white text-xs font-bold",
                                children: initials
                            }, void 0, false, {
                                fileName: "[project]/src/components/NavBar.tsx",
                                lineNumber: 224,
                                columnNumber: 437
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/NavBar.tsx",
                            lineNumber: 224,
                            columnNumber: 321
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "hidden sm:inline text-sm font-semibold text-[#111827]",
                            children: userName
                        }, void 0, false, {
                            fileName: "[project]/src/components/NavBar.tsx",
                            lineNumber: 224,
                            columnNumber: 507
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                            className: `w-4 h-4 text-[#9ca3af] transition-transform ${isDropdownOpen ? "rotate-180" : ""}`
                        }, void 0, false, {
                            fileName: "[project]/src/components/NavBar.tsx",
                            lineNumber: 224,
                            columnNumber: 596
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/NavBar.tsx",
                    lineNumber: 224,
                    columnNumber: 158
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$motion$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                    children: isDropdownOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$motion$2f$dist$2f$es$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: -10
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        exit: {
                            opacity: 0,
                            y: -10
                        },
                        transition: {
                            duration: 0.2
                        },
                        className: "absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0px_15px_40px_0px_rgba(17,24,39,0.12)] border border-white/80 overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-3 border-b border-[#f3f4f6] bg-[#faf9ff]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-bold text-[#111827]",
                                        children: userName
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/NavBar.tsx",
                                        lineNumber: 235,
                                        columnNumber: 218
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-[#9ca3af]",
                                        children: userEmail
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/NavBar.tsx",
                                        lineNumber: 235,
                                        columnNumber: 280
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/NavBar.tsx",
                                lineNumber: 235,
                                columnNumber: 158
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "py-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setIsDropdownOpen(false);
                                        setHasSession(false);
                                        onLogout?.();
                                    },
                                    className: "w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/NavBar.tsx",
                                            lineNumber: 239,
                                            columnNumber: 134
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        "Log Out"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/NavBar.tsx",
                                    lineNumber: 235,
                                    columnNumber: 361
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/NavBar.tsx",
                                lineNumber: 235,
                                columnNumber: 339
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/NavBar.tsx",
                        lineNumber: 224,
                        columnNumber: 752
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/NavBar.tsx",
                    lineNumber: 224,
                    columnNumber: 716
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/NavBar.tsx",
            lineNumber: 224,
            columnNumber: 105
        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-4 shrink-0",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/signin",
                    className: "text-sm font-semibold text-[#4b5563] hover:text-[#111827] transition-colors",
                    children: "Sign In"
                }, void 0, false, {
                    fileName: "[project]/src/components/NavBar.tsx",
                    lineNumber: 239,
                    columnNumber: 277
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/signup",
                    className: "px-[22px] py-[11px] bg-[#111827] text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity drop-shadow-[0px_4px_6px_rgba(17,24,39,0.1)]",
                    children: "Get Started"
                }, void 0, false, {
                    fileName: "[project]/src/components/NavBar.tsx",
                    lineNumber: 239,
                    columnNumber: 400
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/NavBar.tsx",
            lineNumber: 239,
            columnNumber: 227
        }, ("TURBOPACK compile-time value", void 0));
        $[20] = initials;
        $[21] = isAuthenticated;
        $[22] = isDropdownOpen;
        $[23] = onLogout;
        $[24] = sessionReady;
        $[25] = userEmail;
        $[26] = userName;
        $[27] = t11;
    } else {
        t11 = $[27];
    }
    let t12;
    if ($[28] !== t10 || $[29] !== t11) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
            className: "fixed top-6 inset-x-4 sm:inset-x-8 lg:inset-x-20 z-50 font-['DM_Sans',_sans-serif]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex items-center justify-between gap-4 rounded-full border border-white bg-white/80 backdrop-blur-[10px] pl-6 pr-3.5 py-3.5 shadow-[0px_2px_8px_0px_rgba(31,41,55,0.04),0px_8px_32px_0px_rgba(31,41,55,0.06)]",
                children: [
                    t9,
                    t10,
                    t11
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/NavBar.tsx",
                lineNumber: 253,
                columnNumber: 111
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/NavBar.tsx",
            lineNumber: 253,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[28] = t10;
        $[29] = t11;
        $[30] = t12;
    } else {
        t12 = $[30];
    }
    return t12;
};
_s(Navbar, "Hbfvk1ZA3DnhtYcdr+sgqNJmAxI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = Navbar;
function _temp(n) {
    return n[0];
}
var _c;
__turbopack_context__.k.register(_c, "Navbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/auth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authHeaders",
    ()=>authHeaders,
    "clearSession",
    ()=>clearSession,
    "getAccessToken",
    ()=>getAccessToken,
    "getRefreshToken",
    ()=>getRefreshToken,
    "getStoredUser",
    ()=>getStoredUser,
    "isAuthenticated",
    ()=>isAuthenticated,
    "saveSession",
    ()=>saveSession
]);
// src/lib/auth.ts
'use client';
// Client-side storage for the Supabase session tokens our backend hands
// back from /api/auth/signin, /signup, and the OAuth callback. Nothing
// in the frontend persisted these before — without this, every call to
// a protected endpoint (e.g. POST /api/analyze) has no Authorization
// header and 401s against get_current_user in the backend.
//
// localStorage (not cookies) because there's no server-rendered route
// here that needs the token before hydration — everything reading it
// runs client-side.
const ACCESS_TOKEN_KEY = 'aura_access_token';
const REFRESH_TOKEN_KEY = 'aura_refresh_token';
const USER_KEY = 'aura_user';
function saveSession(accessToken, refreshToken, user) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } else {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
    if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
}
function getAccessToken() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}
function getRefreshToken() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}
function getStoredUser() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch  {
        return null;
    }
}
function isAuthenticated() {
    return !!getAccessToken();
}
function clearSession() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}
function authHeaders(extra) {
    const headers = new Headers(extra);
    const token = getAccessToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_1c_adbr._.js.map