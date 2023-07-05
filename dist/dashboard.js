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
function addStyles(styles, el) {
    for (const key in styles) {
        el.style[key] = styles[key];
    }
}
function getFilteredOrdersByCustomStatus(status) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "https://nettenshop.webshopapp.com/admin/orders?custom_status=" + status;
        const response = yield fetch(url);
        const html = yield response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const orders_table = doc.querySelector("#table_orders > div > div > table > tbody");
        const result = [];
        for (const row of Array.from((orders_table === null || orders_table === void 0 ? void 0 : orders_table.children) || [])) {
            const order_number_element = row.children[1].children[0].children[0];
            const order_number = order_number_element.innerHTML.trim();
            const href = order_number_element.getAttribute("href") || "#";
            const name = row.children[2].children[0].children[0].innerHTML.trim();
            const stringDate = row.children[4].children[0].innerHTML
                .trim()
                .split(" om ")[0];
            result.push({
                order_number,
                customer_name: name,
                href,
                date: stringDate,
            });
        }
        return result;
    });
}
function init() {
    const $ = (el) => document.querySelectorAll(el);
    const styles = `
    .item_styles {
      color: #494c4c;
      background: #fff;
      border: solid 1px #c4cacc;
      padding: 12px;
      border-radius: 3px;
      min-height: 12rem;
    }

    .item_wrapper_styles {
      display: grid;
      padding: 0 6px;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 12px;
    }

    .order_table_styles {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .order_table_row_styles {
      display: flex;
      justify-content: space-between;
    }

    .subtitle_styles {
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: 6px;
      text-transform: capitalize;
    }

    .subtitle_styles > span {
      color: #848a8a;
      font-weight: normal;
    }

    @media (max-width: 768px) {
      .item_wrapper_styles {
        grid-template-columns: 1fr;
      }
    }

  `;
    const stylesElement = document.createElement("style");
    stylesElement.innerHTML = styles;
    document.head.appendChild(stylesElement);
    const dashboard_items = $(".container")[2];
    if (!dashboard_items)
        return;
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
    if (warning.length > 0) {
        warning[0].remove();
    }
    const item_wrapper = document.createElement("div");
    item_wrapper.classList.add("item_wrapper_styles");
    dashboard_items.appendChild(item_wrapper);
    const orderStatussesToDisplay = [
        "manco-bestelling-van-dijk",
        "spoedbestelling-jvd",
        "besteld-bij-van-jvd-speciale-bestelling",
        "rechtstreeks-vanuit-fabriek-verzenden",
    ];
    const statusNameMap = [
        "Manco",
        "Spoed",
        "Speciale bestelling",
        "Fabriek verzenden",
    ];
    const items_to_add = [];
    for (const status of orderStatussesToDisplay) {
        const status_name = statusNameMap[orderStatussesToDisplay.indexOf(status)];
        getFilteredOrdersByCustomStatus(status).then((orders) => {
            const item = document.createElement("div");
            item.classList.add("item_styles");
            const title = document.createElement("h3");
            title.classList.add("subtitle_styles");
            const order_amount = orders.length || 0;
            title.innerHTML = status_name + ` <span>(${order_amount})</span>`;
            item.appendChild(title);
            const row_wrapper = document.createElement("div");
            row_wrapper.classList.add("order_table_styles");
            for (const order of orders) {
                const row = document.createElement("div");
                row.classList.add("order_table_row_styles");
                row.innerHTML = `
        <p>
          <a href="${order.href}">
            ${order.order_number}
          </a> - ${order.customer_name}
        </p>
        <p>${order.date}</p>
        `;
                row.classList.add("order_row");
                row_wrapper.appendChild(row);
            }
            item.appendChild(row_wrapper);
            if (!orders)
                return;
            item_wrapper.appendChild(item);
            items_to_add.push(item);
        });
    }
}
(() => {
    init();
})();
