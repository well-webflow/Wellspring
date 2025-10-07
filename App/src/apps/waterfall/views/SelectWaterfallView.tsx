import { useEffect } from 'react';
import Card from '../../../components/UI/Card';
import { Heading } from '../../../components/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { useWaterfall } from '../hooks/WaterfallContext';
import Button from '../../../components/UI/Button';

export default function SelectWaterfallView() {
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
    <div className="">
      <div className="w-full flex flex-row justify-between items-center">
        <Heading level={4}>Select a Waterfall to Edit</Heading>
        <FontAwesomeIcon icon={faRotateRight} className="text-text3 cursor-pointer" onClick={search}></FontAwesomeIcon>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between w-full"></div>
        {waterfalls.length ? (
          waterfalls.map((wtf, index) => (
            <Button key={index} onClick={() => selectWaterfall(wtf)}>
              {waterfallNames[index]}
            </Button>
          ))
        ) : (
          <Card>No Waterfalls found on this page.</Card>
        )}
      </div>
    </div>
  );
}
