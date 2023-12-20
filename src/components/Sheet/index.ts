import {registerSheet} from 'react-native-actions-sheet';
import SheetSelectArea from './SheetSelectArea';
import SheetInfo from './SheetInfo';
import SheetComment from './SheetComment';
import SheetSelectPlot from './SheetSelectPlot';

registerSheet('selectArea', SheetSelectArea);
registerSheet('nicknameSheet', SheetInfo);
registerSheet('commentSheet', SheetComment);
registerSheet('selectPlot', SheetSelectPlot);
registerSheet('selectTargetSpray', SheetSelectPlot);

export {};
