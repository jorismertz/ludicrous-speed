type CSS = Partial<CSSStyleDeclaration>;

// Voor elke status ff een mooie item maken met een simpel tabbeltje erin van de orders.
// Ook hyperlinkjes naar de orders zelf.
// title kan doorsturen naar de filter status zelf.

//https://nettenshop.webshopapp.com/admin/orders?custom_status=manco-bestelling-van-dijk
//https://nettenshop.webshopapp.com/admin/orders?custom_status=spoedbestelling-jvd
//https://nettenshop.webshopapp.com/admin/orders?custom_status=besteld-bij-van-jvd-speciale-bestelling
//https://nettenshop.webshopapp.com/admin/orders?custom_status=rechtstreeks-vanuit-fabriek-verzenden

function init() {
  async function getFilteredOrdersByCustomStatus(status: string) {
    const url =
      "https://nettenshop.webshopapp.com/admin/orders?custom_status=" + status;

    const response = await fetch(url);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const table = doc.querySelector(
      "#table_orders > div > div > table > tbody"
    );

    return table?.innerHTML;
  }

  const $ = (el: string) => document.querySelectorAll(el);

  const addStyles = (styles: CSS, el: HTMLElement) => {
    for (const key in styles) {
      el.style[key] = styles[key] as string;
    }
  };

  const item_wrapper_styles: CSS = {
    display: "grid",
    padding: "0 6px",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridGap: "12px",
  };

  const item_styles: CSS = {
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
    if (has_already_run) return;
  } catch (e) {}

  const rerun_preventer = document.createElement("has-run");
  dashboard_items.appendChild(rerun_preventer);

  // Delete last two rows containing graph and advertisements
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
  } catch (e) {}

  const warning = $("#content > div:nth-child(2) > div.alert.wide.warning.top");
  warning[0].remove();

  // Create new item wrapper

  const item_wrapper = document.createElement("div");
  addStyles(item_wrapper_styles, item_wrapper);
  dashboard_items.appendChild(item_wrapper);

  const statusses = [
    "manco-bestelling-van-dijk",
    "spoedbestelling-jvd",
    "besteld-bij-van-jvd-speciale-bestelling",
    "rechtstreeks-vanuit-fabriek-verzenden",
  ];

  const items_to_add: HTMLDivElement[] = [];

  for (const status of statusses) {
    getFilteredOrdersByCustomStatus(status).then((res) => {
      const item = document.createElement("div");
      addStyles(item_styles, item);
      item.innerHTML = res || "null";
      item_wrapper.appendChild(item);
      items_to_add.push(item);

      // test_item.innerHTML = `
      //   <h2>Manco orders</h2>
      //   <p>${amount}</p>
      // `;
    });
  }

  items_to_add.sort((a, b) => {
    // if innerHTML is "null" then put it at the end of the array
    if (a.innerHTML === "null") return 1;
    if (b.innerHTML === "null") return -1;
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
