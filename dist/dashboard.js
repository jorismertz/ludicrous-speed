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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
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
      display: table;
      width: 100%;
    }

    .order_table_styles > thead > tr > th {
      text-align: left;
    }

    .order_table_row_styles {
    }

    .span-2 {
      grid-column: span 2;
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
      .span-2 {
        grid-column: span 1;
      }
    }

  `;
        const stylesElement = document.createElement("style");
        stylesElement.innerHTML = styles;
        document.head.appendChild(stylesElement);
        const dashboard_items = $(".container")[1];
        if (!dashboard_items) {
            return;
        }
        try {
            const has_already_run = dashboard_items.querySelector("has-run");
            if (has_already_run) {
                return;
            }
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
        const order_item_wrapper = document.createElement("div");
        order_item_wrapper.classList.add("item_wrapper_styles");
        order_item_wrapper.style.marginTop = "12px";
        dashboard_items.appendChild(order_item_wrapper);
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
        try {
            for (var _d = true, orderStatussesToDisplay_1 = __asyncValues(orderStatussesToDisplay), orderStatussesToDisplay_1_1; orderStatussesToDisplay_1_1 = yield orderStatussesToDisplay_1.next(), _a = orderStatussesToDisplay_1_1.done, !_a; _d = true) {
                _c = orderStatussesToDisplay_1_1.value;
                _d = false;
                const status = _c;
                const status_name = statusNameMap[orderStatussesToDisplay.indexOf(status)];
                getFilteredOrdersByCustomStatus(status).then((orders) => __awaiter(this, void 0, void 0, function* () {
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
                }));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = orderStatussesToDisplay_1.return)) yield _b.call(orderStatussesToDisplay_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const stock_item = document.createElement("div");
        stock_item.classList.add("item_styles");
        stock_item.classList.add("span-2");
        const stock_title = document.createElement("h3");
        stock_title.classList.add("subtitle_styles");
        stock_title.innerHTML = "Voorraad onder threshold";
        stock_item.appendChild(stock_title);
        const stock_item_table = document.createElement("table");
        stock_item_table.classList.add("order_table_styles");
        stock_item_table.innerHTML = `<thead>
    <tr>
      <th>Product</th>
      <th>Variant</th>
      <th>Voorraad</th>
    </thead>`;
        const stock_item_table_body = document.createElement("tbody");
        stock_item_table.appendChild(stock_item_table_body);
        stock_item.appendChild(stock_item_table);
        const stock_data = fetch("https://netjes.jorismertz.nl/api/get-stock-under-threshold").then((response) => __awaiter(this, void 0, void 0, function* () {
            const data = (yield response.json());
            data.forEach((item) => {
                const row = document.createElement("tr");
                row.classList.add("order_table_row_styles");
                row.innerHTML = `
      <td>${item.title}</td>
      <td><a href="https://nettenshop.webshopapp.com/admin/products/${item.productId}">${item.variantId}</a></td>
      <td>${item.stock}</td>
      `;
                stock_item_table_body.appendChild(row);
            });
            order_item_wrapper.appendChild(stock_item);
        }));
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield init();
}))();
