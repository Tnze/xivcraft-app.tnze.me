import React from 'react';
import { Row, Col, Steps } from 'antd';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import AttributeSelector from './AttributeSelector';
import Simulator from './Simulator';
import './App.global.css';

const { Step } = Steps;

const Hello = () => {
  const [currentPage, setCurentPage] = React.useState(0);
  const [helperLoading, setHelperLoading] = React.useState({ s: 0, p: 0 });
  const [attributes, setAttributes] = React.useState({
    level: 80,
    craftsmanship: 2758,
    control: 2909,
    craftPoint: 641,
  });
  const [recipe, setRecipe] = React.useState({
    recipeLevel: 514,
    baseLevel: 80,
    progress: 12089,
    quality: 75378,
    durability: 55,
  });

  const attrSelector = (
    <AttributeSelector
      attributes={attributes}
      onChangeAttributes={setAttributes}
      recipe={recipe}
      onChangeRecipe={setRecipe}
      onNextPage={() => setCurentPage(1)}
    />
  );

  const simulator = (
    <Simulator
      attributes={attributes}
      recipe={recipe}
      setHelperLoading={(s, p) =>
        setHelperLoading({ s: s === 'touch' ? 2 : 1, p })
      }
    />
  );

  return (
    <div className="App">
      免费软件，NGA帖子：https://bbs.nga.cn/read.php?tid=28176186
      <br />
      网页版：https://xivcraft.tnze.me/
      <Row gutter={[16, 16]}>
        <Col span={20} offset={2}>
          <Steps
            current={currentPage}
            percent={currentPage === 1 ? helperLoading.p * 100 : undefined}
          >
            <Step
              title="选择属性及配方"
              description="请输入您的装备属性，并选择配方"
            />
            <Step
              title="编排技能"
              subTitle={
                // eslint-disable-next-line no-nested-ternary
                currentPage === 1
                  ? helperLoading.p >= 1
                    ? '加载完成'
                    : `${(helperLoading.p * 100).toFixed(1)}% (${
                        helperLoading.s
                      }/2)`
                  : undefined
              }
              description="通过点选当前状态，查看求解器的实时建议"
            />
          </Steps>
        </Col>
      </Row>
      <Row className="Content">
        <Col span={18} offset={3}>
          {currentPage === 0 ? attrSelector : simulator}
        </Col>
      </Row>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
