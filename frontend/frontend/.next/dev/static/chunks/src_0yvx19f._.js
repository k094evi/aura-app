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
function ConditionalLayout(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(28);
    if ($[0] !== "5703ffd1d45dc21876e71e314b9aadb6ae80bf85e68b0618eba2e1707a11d400") {
        for(let $i = 0; $i < 28; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "5703ffd1d45dc21876e71e314b9aadb6ae80bf85e68b0618eba2e1707a11d400";
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
    const hideNavOnly = isLegalRoute && !isLegalFromAuth && !authed;
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
            lineNumber: 108,
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
            lineNumber: 119,
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
            lineNumber: 127,
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
            lineNumber: 135,
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
// components/ConditionalLayout.tsx
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
// borrow it from the "from" query param. (/privacy no longer needs this -
// it always shows the navbar like a normal public page.)
const LEGAL_ROUTES = [
    '/terms-of-service'
];
function ConditionalLayout(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(28);
    if ($[0] !== "f4e1c1fa22066f49e9f470ffc1f476529f242350106e7d488274a5c566fbe2fc") {
        for(let $i = 0; $i < 28; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "f4e1c1fa22066f49e9f470ffc1f476529f242350106e7d488274a5c566fbe2fc";
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
    const hideNavOnly = isLegalRoute && !isLegalFromAuth && !authed;
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
            fileName: "[project]/src/components/NavBar.tsx",
            lineNumber: 111,
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
            fileName: "[project]/src/components/NavBar.tsx",
            lineNumber: 122,
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
            fileName: "[project]/src/components/NavBar.tsx",
            lineNumber: 130,
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
            fileName: "[project]/src/components/NavBar.tsx",
            lineNumber: 138,
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

//# sourceMappingURL=src_0yvx19f._.js.map