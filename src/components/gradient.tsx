import { defineComponent } from "vue";

const Gradient = defineComponent(() => {
  return () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" class="h-0 w-0">
        <defs>
          <linearGradient id="gradient" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" class="stop-color-from" />
            <stop offset="1" class="stop-color-to" />
          </linearGradient>
        </defs>
      </svg>
    );
  };
});

export { Gradient };
