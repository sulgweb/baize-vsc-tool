const baseUrl = 'https://api.dify.ai/v1';
const apiToken = '你的api key';

// 通用 gpt 的调用方式
export const fetchChatSSE = ({ params, callback, onEnd }) => {
  return fetch(baseUrl, {
    method: 'POST',
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
        .map((item) =>
          item.choices.map((choice) => choice.delta.content).join('')
        )
        .join('');
      answer += curAnswer ? curAnswer : '';

      callback(answer, conversation_id, task_id);
      return reader.read().then(process);
    });
  });
};
