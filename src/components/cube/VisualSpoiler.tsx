import React, { useContext, useMemo } from 'react';
import { Flexbox, NumCols } from 'components/base/Layout';
import CardGrid from 'components/card/CardGrid';
import CubeContext from 'contexts/CubeContext';
import useQueryParam from 'hooks/useQueryParam';
import { sortDeep } from 'utils/Sort';
import CardType, { BoardType } from 'datatypes/Card';
import Button from 'components/base/Button';
import Card from 'datatypes/Card';

interface VisualSpoilerProps {
  cards: CardType[];
}

const VisualSpoiler: React.FC<VisualSpoilerProps> = ({ cards }) => {
  const { sortPrimary, sortSecondary, sortTertiary, sortQuaternary, cube, setModalSelection, setModalOpen } =
    useContext(CubeContext);

  const sorted = useMemo(
    () =>
      sortDeep(
        cards,
        cube.showUnsorted || false,
        sortQuaternary || 'Alphabetical',
        sortPrimary || 'Color Category',
        sortSecondary || 'Types-Multicolor',
        sortTertiary || 'CMC',
      ) as unknown as [string, [string, [string, Card[]][]][]][],
    [cards, cube.showUnsorted, sortQuaternary, sortPrimary, sortSecondary],
  );
  const cardList: Card[] = sorted
    .map((tuple1) => tuple1[1].map((tuple2) => tuple2[1].map((tuple3) => tuple3[1].map((card) => card))))
    .flat(4);
  const [scale, setScale] = useQueryParam('scale', 'medium');

  let sizes: Record<string, NumCols> = {
    xs: 3,
    sm: 4,
    md: 6,
    lg: 6,
    xl: 8,
  };

  if (scale === 'small') {
    sizes = {
      xs: 4,
      sm: 5,
      md: 8,
      lg: 8,
      xl: 10,
    };
  } else if (scale === 'large') {
    sizes = {
      xs: 2,
      sm: 3,
      md: 4,
      lg: 4,
      xl: 5,
    };
  }

  return (
    <div className="my-2">
      <Flexbox direction="row" justify="center" gap="2">
        <Button onClick={() => setScale('small')} outline={scale !== 'small'}>
          Small
        </Button>
        <Button onClick={() => setScale('medium')} outline={scale !== 'medium'}>
          Medium
        </Button>
        <Button onClick={() => setScale('large')} outline={scale !== 'large'}>
          Large
        </Button>
      </Flexbox>
      <CardGrid
        cards={cardList}
        onClick={(card) => {
          setModalSelection({ board: card.board as BoardType, index: card.index || -1 });
          setModalOpen(true);
        }}
        xs={sizes.xs}
        sm={sizes.sm}
        md={sizes.md}
        lg={sizes.lg}
        xl={sizes.xl}
      />
    </div>
  );
};

export default VisualSpoiler;
