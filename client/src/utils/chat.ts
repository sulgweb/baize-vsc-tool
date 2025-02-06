import { asyncPostMessage } from './webview';

const getApiToken = async () => {
  const res = await asyncPostMessage({
    command: 'vscGetSetting',
  });
  return res.data.apiKey;
};

const getDifyUrl = async () => {
  const res = await asyncPostMessage({
    command: 'vscGetSetting',
  });
  return res.data.difyUrl;
};

// 通用 gpt 的调用方式
export const fetchChatSSE = async ({ params, callback, onEnd }) => {
  const apiToken = await getApiToken();
  const difyUrl = await getDifyUrl();

  const chatUrl = `${difyUrl}/completion-messages`;
  return fetch(chatUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify({
      ...params,
      user: 'baize',
      response_mode: 'streaming',
    }),
  }).then(async (response) => {
    const reader = response.body.getReader();
    let answer = '';
    let conversation_id = '';
    let task_id = '';
    reader.read().then(function process({ done, value }) {
      if (done) {
        console.log('Stream closed');
        onEnd(conversation_id);
        return;
      }
      const message = new TextDecoder('utf-8')
        .decode(value)
        .replace(/data:/g, '')
        .replace(/event: ping/, '');

      const answerList = message
        .split('\n\n')
        .filter((item) => item)
        .map((item) => {
          try {
            return JSON.parse(item);
          } catch (e) {
            console.error(e);
            return null;
          }
        })
        .filter((item) => item);
      const curAnswer = answerList
        .filter((item) => item.event === 'message')
        .map((item) => item.answer)
        .join('');
      answer += curAnswer ? curAnswer : '';
      console.log('answer:', answer);

      callback(answer, conversation_id, task_id);
      return reader.read().then(process);
    });
  });
};
