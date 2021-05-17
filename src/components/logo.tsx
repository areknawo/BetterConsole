import { FunctionalComponent } from "vue";

const Logo: FunctionalComponent = () => {
  return (
    <svg viewBox="0 0 24 24" class="text-white">
      <rect class="fill-gradient hidden" width="24" height="24" rx="6" />
      <rect
        class="fill-current opacity-50"
        x="1.96"
        y="12.77"
        width="11.2"
        height="3.73"
        rx="0.93"
        transform="translate(-8.13 9.63) rotate(-45)"
      />
      <rect class="fill-current" x="10.13" y="15.7" width="11.2" height="3.73" rx="0.93" />
      <rect
        class="fill-current"
        x="5.69"
        y="3.77"
        width="3.73"
        height="11.2"
        rx="0.93"
        transform="translate(-4.41 8.09) rotate(-45)"
      />
    </svg>
  );
};

export { Logo };
