import React from 'react';
import { Row, Col, Steps } from 'antd';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import AttributeSelector from './AttributeSelector';
import Simulator from './Simulator';
import './App.global.css';

const { Step } = Steps;

const Hello = () => {
  const [currentPage, setCurentPage] = React.useState(0);
  const [helperLoading, setHelperLoading] = React.useState(0);
  const [attributes, setAttributes] = React.useState({
    level: 80,
    craftsmanship: 2830,
    control: 2710,
    craftPoint: 636,
  });
  const [recipe, setRecipe] = React.useState({
    recipeLevel: 510,
    baseLevel: 80,
    progress: 8591,
    quality: 56662,
    durability: 70,
  });

  const attrSelector = (
    <AttributeSelector
      attributes={attributes}
      onChangeAttributes={setAttributes}
      recipe={recipe}
      onChangeRecipe={setRecipe}
    />
  );

  const simulator = (
    <Simulator
      attributes={attributes}
      recipe={recipe}
      setHelperLoading={(_s, p) => setHelperLoading(p)}
    />
  );

  return (
    <div className="App">
      <Row gutter={[16, 16]}>
        <Col span={20} offset={2}>
          <Steps
            current={currentPage}
            onChange={setCurentPage}
            percent={currentPage === 1 ? helperLoading * 100 : undefined}
          >
            <Step
              title="选择属性及配方"
              description="请输入您的装备属性，并选择需要制作的道具"
            />
            <Step
              title="编排技能"
              subTitle={
                // eslint-disable-next-line no-nested-ternary
                currentPage === 1
                  ? helperLoading >= 1
                    ? '自动补全正在工作'
                    : `正在加载求解器: ${(helperLoading * 100).toFixed(1)}%`
                  : undefined
              }
              description="通过点选及拖拽设计制作流程，并实时查看模拟结果"
            />
            <Step
              title="导出宏"
              subTitle="⚠️正在施工"
              description="将您的技能导出为游戏宏方便一键使用"
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
