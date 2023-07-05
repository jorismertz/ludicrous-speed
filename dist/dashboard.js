"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function init() {
    function getFilteredOrdersByCustomStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = "https://nettenshop.webshopapp.com/admin/orders?custom_status=" + status;
            const response = yield fetch(url);
            const html = yield response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const table = doc.querySelector("#table_orders > div > div > table > tbody");
            return table === null || table === void 0 ? void 0 : table.innerHTML;
        });
    }
    const $ = (el) => document.querySelectorAll(el);
    const addStyles = (styles, el) => {
        for (const key in styles) {
            el.style[key] = styles[key];
        }
    };
    const item_wrapper_styles = {
        display: "grid",
        padding: "0 6px",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridGap: "12px",
    };
    const item_styles = {
        color: "#494c4c",
        background: "#fff",
        border: "solid 1px #c4cacc",
        padding: "6px",
        borderRadius: "3px",
        minHeight: "12rem",
    };
    const dashboard_items = $(".container")[2];
    try {
        const has_already_run = dashboard_items.querySelector("has-run");
        if (has_already_run)
            return;
    }
    catch (e) { }
    const rerun_preventer = document.createElement("has-run");
    dashboard_items.appendChild(rerun_preventer);
    try {
        if (dashboard_items.childNodes.length > 3) {
            const rowsToDelete = [
                dashboard_items.childNodes[3],
                dashboard_items.childNodes[5],
            ];
            for (const row of rowsToDelete) {
                row.remove();
            }
        }
    }
    catch (e) { }
    const warning = $("#content > div:nth-child(2) > div.alert.wide.warning.top");
    warning[0].remove();
    const item_wrapper = document.createElement("div");
    addStyles(item_wrapper_styles, item_wrapper);
    dashboard_items.appendChild(item_wrapper);
    const statusses = [
        "manco-bestelling-van-dijk",
        "spoedbestelling-jvd",
        "besteld-bij-van-jvd-speciale-bestelling",
        "rechtstreeks-vanuit-fabriek-verzenden",
    ];
    const items_to_add = [];
    for (const status of statusses) {
        getFilteredOrdersByCustomStatus(status).then((res) => {
            const item = document.createElement("div");
            addStyles(item_styles, item);
            item.innerHTML = res || "null";
            item_wrapper.appendChild(item);
            items_to_add.push(item);
        });
    }
    items_to_add.sort((a, b) => {
        if (a.innerHTML === "null")
            return 1;
        if (b.innerHTML === "null")
            return -1;
        return 0;
    });
    for (const item of items_to_add) {
        item_wrapper.appendChild(item);
    }
    console.log(items_to_add);
}
(() => {
    init();
})();
