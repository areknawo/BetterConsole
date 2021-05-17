import { Ref, inject, provide, ref } from "vue";

const setupIsMoving = (): Ref<boolean> => {
  const isMoving = ref(false);
  const isChecking = ref(false);
  const movingTimeoutHandle = ref(0);

  document.addEventListener("mousedown", () => {
    isChecking.value = true;
  });
  document.addEventListener("mouseup", () => {
    isChecking.value = false;
  });
  document.addEventListener("mousemove", () => {
    if (isChecking.value) {
      clearTimeout(movingTimeoutHandle.value);
      isMoving.value = true;
      movingTimeoutHandle.value = setTimeout(() => {
        isMoving.value = false;
      }, 300);
    }
  });
  provide("isMoving", isMoving);

  return isMoving;
};
const useIsMoving = (): Ref<boolean> => {
  return inject<Ref<boolean>>("isMoving", ref(false));
};

export { setupIsMoving, useIsMoving };
