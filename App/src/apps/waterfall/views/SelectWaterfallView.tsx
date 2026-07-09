import { useEffect } from 'react';
import Card from '../../../components/UI/Card';
import { Heading } from '../../../components/Typography';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { useWaterfall } from '../hooks/WaterfallContext';
import Button from '../../../components/UI/Button';
import { useNavigate } from 'react-router';
import { Toolbar } from '../../../components/UI/Toolbar';

export default function SelectWaterfallView() {
  const { waterfalls, waterfallNames, searchForWaterfalls, loadWaterfall, unloadWaterfall } = useWaterfall();
  const navigate = useNavigate();

  useEffect(() => {
    unloadWaterfall();
    searchForWaterfalls();
  }, []);

  async function selectWaterfall(wtf: AnyElement) {
    webflow.setSelectedElement(wtf);
    const name = await loadWaterfall();
    const routeName = name ?? 'unknown';
    navigate(`/waterfall/edit/${routeName}`);
  }

  function search() {
    searchForWaterfalls();
    console.log(waterfalls);
    console.log(waterfallNames);
  }

  return (
    <div>
      <Toolbar>
        <Heading level={4}>Select a Waterfall to Edit</Heading>
        <Button size="sm" onClick={search} icon={faRotateRight}></Button>
      </Toolbar>
      <div className="p-3">
        <div className="flex flex-col gap-2">
          {waterfalls.length ? (
            waterfalls.map((wtf, index) => (
              <Button key={index} onClick={() => selectWaterfall(wtf)}>
                {waterfallNames[index]}
              </Button>
            ))
          ) : (
            <Card>
              No Waterfalls found on this page. If your waterfall is inside a Component, double-click into the Component
              and click refresh.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
