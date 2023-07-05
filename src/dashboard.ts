type CSS = Partial<CSSStyleDeclaration>;

// Voor elke status ff een mooie item maken met een simpel tabbeltje erin van de orders.
// Ook hyperlinkjes naar de orders zelf.
// title kan doorsturen naar de filter status zelf.

//https://nettenshop.webshopapp.com/admin/orders?custom_status=manco-bestelling-van-dijk
//https://nettenshop.webshopapp.com/admin/orders?custom_status=spoedbestelling-jvd
//https://nettenshop.webshopapp.com/admin/orders?custom_status=besteld-bij-van-jvd-speciale-bestelling
//https://nettenshop.webshopapp.com/admin/orders?custom_status=rechtstreeks-vanuit-fabriek-verzenden

function init() {
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

  const subtitle_styles: CSS = {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "6px",
    textTransform: "capitalize",
  };

  const order_table_styles = {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  };

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

    // console.log();
    let res = document.createElement("section");
    addStyles(order_table_styles, res);

    for (const row of Array.from(table?.children || [])) {
      const order_number = row.children[1].children[0].innerHTML.trim();
      const name = row.children[2].children[0].innerHTML.trim();

      res.innerHTML += `<div>${order_number} ${name}</div>`;
    }

    return res;
  }

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

  const status_names = [
    "Manco",
    "Spoed",
    "Speciale bestelling",
    "Fabriek verzenden",
  ];

  const items_to_add: HTMLDivElement[] = [];

  for (const status of statusses) {
    const status_name = status_names[statusses.indexOf(status)];

    getFilteredOrdersByCustomStatus(status).then((res) => {
      const item = document.createElement("div");
      addStyles(item_styles, item);

      const title = document.createElement("h3");
      addStyles(subtitle_styles, title);

      const order_amount = res?.children.length || 0;

      title.innerText = status_name + ` (${order_amount})`;
      item.appendChild(title);
      item.appendChild(res);

      if (!res) return;

      item_wrapper.appendChild(item);
      items_to_add.push(item);
    });
  }
}

(() => {
  init();
})();
