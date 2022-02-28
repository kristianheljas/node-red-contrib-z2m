const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

export function mirrorElementClass(source: Element, target: Element, mirrorClassName: string | string[]): void {
  const mirrorClassNames = typeof mirrorClassName === 'string' ? [mirrorClassName] : mirrorClassName;

  const updateTargetClasses = (sourceClasses: DOMTokenList) => {
    mirrorClassNames.forEach((className) => {
      if (sourceClasses.contains(className)) {
        target.classList.add(className);
      } else {
        target.classList.remove(className);
      }
    });
  };

  // Setup observer for source element class changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class' && mutation.target instanceof Element) {
        updateTargetClasses(mutation.target.classList);
      }
    });
  });
  observer.observe(source, { attributes: true, attributeFilter: ['class'] });

  // And update right away
  updateTargetClasses(source.classList);
}

export function onConfigChanged(inputSelector: string, callback: (configNodeId: string) => void): void {
  const $configSelect = $<HTMLSelectElement>(inputSelector);

  let previousBrokerId: string | null = null;

  $configSelect.on('change', async () => {
    const brokerId = $configSelect.val() as string;

    // change event gets triggered multiple times when opening form
    // but we don't want to emit repeated values
    if (brokerId === previousBrokerId) {
      return;
    }

    // ignore initial value which gets set by javascript
    if (previousBrokerId !== null) {
      callback(brokerId);
    }

    previousBrokerId = brokerId;
  });
}

export function getBrokersFor(node: { z?: string }): string[] {
  const brokers: string[] = [];
  try {
    RED.nodes.eachConfig((config) => {
      if (config.type === 'z2m-broker') {
        // This is what you get when using internal APIs (`d` is for disabled)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore 2339
        const enabled = !config.d;

        const accessible = !config.z || config.z === node.z;
        if (enabled && accessible) {
          brokers.push(config.id || '');
        }
      }
      return true;
    });
  } catch (e) {
    /* since using internal and undocumented APIs, fail gracefully */
  }
  return brokers;
}

export default {};
