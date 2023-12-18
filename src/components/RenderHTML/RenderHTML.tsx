import React, {useMemo} from 'react';
import RHTML, {RenderHTMLProps} from 'react-native-render-html';
import {colors, font} from '../../assets';

interface Props extends RenderHTMLProps {}
export default function RenderHTML(props: Props) {
  const htmlCss = useMemo(() => {
    return {
      ...props.tagsStyles,
      body: {
        color: colors.fontBlack,
        ...props.tagsStyles?.body,
      },
    };
  }, [props.tagsStyles]);

  return (
    <RHTML
      {...props}
      enableExperimentalBRCollapsing
      tagsStyles={htmlCss}
      defaultTextProps={{
        allowFontScaling: false,
      }}
      systemFonts={[font.regular, font.semiBold, font.medium, font.bold]}
    />
  );
}
