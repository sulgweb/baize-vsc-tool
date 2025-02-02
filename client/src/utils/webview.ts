let vscode;
if (process.env.NODE_ENV === 'development') {
  vscode = {
    postMessage: (data) => {
      parent.window.postMessage(
        {
          message: 'vscodePostMessage',
          data,
        },
        '*'
      );
    },
    setState: (data) => {
      parent.window.postMessage(
        {
          message: 'vscodeSetState',
          data,
        },
        '*'
      );
    },
    getState: (data) => {
      parent.window.postMessage(
        {
          message: 'vscodeGetState',
          data,
        },
        '*'
      );
    },
  };
} else {
  vscode = acquireVsCodeApi();
}

const setGlobalState = (data) => {
  parent.window.postMessage(
    {
      message: 'vscodePostMessage',
      data: {
        command: 'setGlobalState',
        data,
      },
    },
    '*'
  );
};

const getGlobalState = (data) => {
  parent.window.postMessage(
    {
      message: 'vscodePostMessage',
      data: {
        command: 'getGlobalState',
        data,
      },
    },
    '*'
  );
};

export { vscode, setGlobalState, getGlobalState };
