import { useEffect } from 'react';
import Card from '../../../../components/Card';
import { Heading } from '../../../../components/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { StickyNavigation } from '../../components/Navbar';
import { useWaterfall } from '../../hooks/WaterfallContext';

export default function WaterfallSearchView() {
  const { waterfalls, waterfallNames, searchForWaterfalls, loadAndEditWaterfall } = useWaterfall();

  useEffect(() => {
    searchForWaterfalls();
  }, []);

  function selectWaterfall(wtf: AnyElement) {
    webflow.setSelectedElement(wtf);
    loadAndEditWaterfall();
  }

  function search() {
    searchForWaterfalls();
    console.log(waterfalls);
    console.log(waterfallNames);
  }

  return (
    <div>
      <StickyNavigation onGoBack={() => {}}>
        <div className="w-full flex flex-row justify-between items-center">
          <Heading level={4}>Select a Waterfall to Edit</Heading>
          <FontAwesomeIcon
            icon={faRotateRight}
            className="text-text3 cursor-pointer"
            onClick={search}
          ></FontAwesomeIcon>
        </div>
      </StickyNavigation>
      <div className="flex flex-col gap-4 p-2">
        <div className="flex flex-row items-center justify-between w-full"></div>
        {waterfalls.length ? (
          waterfalls.map((wtf, index) => (
            <Card key={index} onClick={() => selectWaterfall(wtf)}>
              {waterfallNames[index]}
            </Card>
          ))
        ) : (
          <Card>No Waterfalls found on this page.</Card>
        )}
      </div>
    </div>
  );
}
