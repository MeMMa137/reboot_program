// Reboot Frontend Application
// Minimal JS - most logic handled server-side via Rails forms
(function () {
  /**
   * Initializes signout button across all pages.
   * Creates a form to POST the signout request.
   */
  function initSignout() {
    const signoutBtn = document.getElementById("signout-btn");
    if (signoutBtn) {
      signoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/signout";

        const methodInput = document.createElement("input");
        methodInput.type = "hidden";
        methodInput.name = "_method";
        methodInput.value = "delete";
        form.appendChild(methodInput);

        const csrfToken = document.querySelector('meta[name="csrf-token"]');
        if (csrfToken) {
          const tokenInput = document.createElement("input");
          tokenInput.type = "hidden";
          tokenInput.name = "authenticity_token";
          tokenInput.value = csrfToken.content;
          form.appendChild(tokenInput);
        }

        document.body.appendChild(form);
        form.submit();
      });
    }
  }

  /**
   * Initializes the create project modal.
   * Handles open/close via button clicks and keyboard.
   */
  function initProjectModal() {
    const modal = document.getElementById("create-project-modal");
    const createBtns = document.querySelectorAll("#create-project-btn");
    const closeBtn = modal?.querySelector(".modal__close");
    const backdrop = modal?.querySelector(".modal__backdrop");

    function openModal() {
      if (modal) {
        modal.classList.remove("modal--hidden");
        modal.querySelector("input")?.focus();
      }
    }

    function closeModal() {
      if (modal) {
        modal.classList.add("modal--hidden");
      }
    }

    createBtns.forEach((btn) => btn.addEventListener("click", openModal));
    closeBtn?.addEventListener("click", closeModal);
    backdrop?.addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  /**
   * Shop page interactions:
   * - Clicking a category item on the left shows its detail panel on the right
   * - Visually toggles the active state
   */
  function initShopPage() {
    const buttons = document.querySelectorAll(".shop-category-item");
    const panels = document.querySelectorAll(".shop-item-detail");
    if (!buttons.length || !panels.length) return;

    // Modal elements
    const modal = document.getElementById("shop-item-modal");
    const modalClose = modal?.querySelector(".modal__close");
    const modalBackdrop = modal?.querySelector(".modal__backdrop");
    const modalTitle = document.getElementById("shop-modal-title");
    const modalImage = document.getElementById("shop-modal-image");
    const modalDesc = document.getElementById("shop-modal-desc");
    const modalPrice = document.getElementById("shop-modal-price");
    const modalForm = document.getElementById("shop-modal-form");
    const modalItemId = document.getElementById("shop-modal-item-id");
    const modalVariant = document.getElementById("shop-modal-variant");
    const modalBuy = document.getElementById("shop-modal-buy");
    const userBalance = Number(modal?.dataset.userBalance || 0);

    function activate(targetId) {
      buttons.forEach((b) => b.classList.remove("is-active"));
      panels.forEach((p) => p.classList.remove("is-active"));
      const btn = Array.from(buttons).find((b) => b.dataset.target === targetId);
      const panel = document.getElementById(targetId);
      if (btn) btn.classList.add("is-active");
      if (panel) panel.classList.add("is-active");
    }

    function openModal(data) {
      if (!modal) return;
      const variantLower = (data.variant || "").toLowerCase();
      const display = data.display || (data.name ? `${data.name}_${variantLower}` : 'Item');
      modalTitle.textContent = display;
      modalImage.src = data.img || "/images/signin/hackclub.svg";
      modalDesc.textContent = data.desc || "No description available.";
      modalPrice.textContent = String(data.price ?? 0);
      modalItemId.value = data.itemId || "";
      modalVariant.value = data.variant || "";
      // enable/disable buy
      const priceNum = Number(data.price || 0);
      const canBuy = Boolean(data.itemId) && userBalance >= priceNum;
      modalBuy.disabled = !canBuy;
      modal.classList.remove("modal--hidden");
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.add("modal--hidden");
    }

    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".price-btn");
      if (btn) {
        const data = {
          itemId: btn.dataset.itemId,
          name: btn.dataset.name,
          variant: btn.dataset.variant,
          display: btn.dataset.display,
          price: Number(btn.dataset.price || 0),
          img: btn.dataset.img,
          desc: btn.dataset.desc,
        };
        openModal(data);
      }
    });

    modalClose?.addEventListener("click", closeModal);
    modalBackdrop?.addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        activate(btn.dataset.target);
      });
    });
  }

  // Page initialization
  document.addEventListener("DOMContentLoaded", () => {
    initSignout();

    const page = document.body.dataset.page;
    if (page === "projects") {
      initProjectModal();
    }
    if (page === "shop") {
      initShopPage();
    }
  });
})();
