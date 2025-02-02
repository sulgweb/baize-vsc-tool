import React from 'react';
import Markdown from 'react-markdown';

interface IAppMarkdownProps {
  markdown: string;
}

export default function AppMarkdown(props: IAppMarkdownProps) {
  const { markdown } = props;
  return <Markdown>{markdown}</Markdown>;
}
