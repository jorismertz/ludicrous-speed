function init() {
  const $ = (el: string) => document.querySelectorAll(el);

  type CSS = Partial<CSSStyleDeclaration>;
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

  // Create new item wrapper

  const item_wrapper = document.createElement("div");
  addStyles(item_wrapper_styles, item_wrapper);
  dashboard_items.appendChild(item_wrapper);

  // Test item

  const test_item = document.createElement("div");
  test_item.innerText = "Test Item";
  addStyles({ ...item_styles, gridColumn: "span 2" }, test_item);
  item_wrapper.appendChild(test_item);

  const test_item2 = document.createElement("div");
  addStyles(item_styles, test_item2);
  item_wrapper.appendChild(test_item2);

  const cat = document.createElement("img");
  cat.src =
    "https://thumbs.gfycat.com/DeficientYellowishKilldeer-size_restricted.gif";
  cat.style.margin = "0 auto";
  test_item2.appendChild(cat);
}

(() => {
  init();
})();
