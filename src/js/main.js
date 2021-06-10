document.addEventListener('DOMContentLoaded', (e) => {
  // Backdrop open/close
  (() => {
    const refs = {
      body: document.querySelector("body"),
      backdrop: document.querySelector(".backdrop"),
      openModalBtn: document.querySelectorAll("[data-modal-open]"),
      closeModalBtn: document.querySelector("[data-modal-close]"),
      modal: document.querySelector("[data-modal]"),
    };

    //Can use Bubbling instead
    refs.openModalBtn.forEach((btn) => btn.addEventListener("click", onModalOpen));
    refs.closeModalBtn.addEventListener("click", onModalClose);
    refs.backdrop.addEventListener('click', onBackDropClick);

    function onModalOpen() {
      window.addEventListener('keydown', onPressEscape);
      refs.body.classList.add('no__scroll');
      refs.modal.classList.remove("is-hidden");
    }

    function onModalClose() {
      window.removeEventListener('keydown', onPressEscape);
      refs.body.classList.remove('no__scroll');
      refs.modal.classList.add("is-hidden");
    }

    function onBackDropClick(event) {
      if (event.target === event.currentTarget) {
        onModalClose();
      }
    }
    function onPressEscape(event) {
      if (event.code === 'Escape') {
        onCloseModal();
      }
    }
  })();

//Form data log
(() => {
  const formRef = document.querySelector(".form");
  formRef.addEventListener("submit", (e) => {
    e.preventDefault();
    new FormData(e.currentTarget).forEach((value, name) =>
      console.log(`${name}: ${value}`)
    );
    e.currentTarget.reset();
  });
})();


//TIMER

const refs = {
  daysValue: document.querySelector('[data-value="days"]'),
  hoursValue: document.querySelector('[data-value="hours"]'),
  minutesValue: document.querySelector('[data-value="mins"]'),
  secondsValue: document.querySelector('[data-value="secs"]'),
};
const timer = {

    start() {
        const targetDate = new Date('Jul 19, 2021');

        let countdownId = setInterval(() => {
            const time = targetDate - Date.now();
            updateCountdown(time);
        }, 1000);

        if (Date.now() >= targetDate) {
            clearInterval(countdownId);
            return;
        }
    }
}
timer.start()

function updateCountdown(time) {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = pad(Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
    const mins = pad(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));
    const secs = pad(Math.floor((time % (1000 * 60)) / 1000));

    refs.daysValue.textContent = days;
    refs.hoursValue.textContent = hours;
    refs.minutesValue.textContent = mins;
    refs.secondsValue.textContent = secs;
}

function pad(value) {
    return String(value).padStart(2, '0');
}
});
