import React from 'react';
import { Button, Row, Col, Form, InputNumber, Cascader } from 'antd';
import {
  CascaderOptionType,
  CascaderValueType,
  FilledFieldNamesType,
} from 'antd/lib/cascader';
import Culinarian from '../../assets/recipes/Culinarian.json';
import { Attributes, Recipe } from './Simulator';

interface IAttributeProps {
  recipe: Recipe;
  onChangeRecipe: (r: Recipe) => void;
  attributes: Attributes;
  onChangeAttributes: (a: Attributes) => void;
  onNextPage: () => void;
}

const data: CascaderOptionType[] = [
  {
    value: 'custom',
    label: '自定义',
  },
  {
    label: '辉煌第一阶段',
    value: 34610,
  },
  {
    label: '辉煌第二阶段',
    value: 34618,
  },
  {
    label: '辉煌第三阶段',
    value: 34626,
  },
];

function filter(
  inputValue: string,
  path: CascaderOptionType[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _names: FilledFieldNamesType
) {
  return path.some((option) => {
    const label = option.label?.toString().toLowerCase();
    if (!label) return false;
    return label.indexOf(inputValue.toLowerCase()) > -1;
  });
}

export default function AttributeSelector({
  onChangeAttributes,
  onChangeRecipe,
  recipe,
  attributes,
  onNextPage,
}: IAttributeProps) {
  const [recipePath, setRecipePath] = React.useState<CascaderValueType>([
    34610,
  ]);
  const onRecipeChange = (x: CascaderValueType) => {
    setRecipePath(x);
    if (x[0] !== 'custom') {
      const r = Culinarian.find((e) => e.recipeId === Number(x[0]));
      if (r !== undefined) {
        onChangeRecipe({
          recipeLevel: r.level,
          baseLevel: r.baseLevel,
          progress: r.difficulty,
          quality: r.maxQuality,
          durability: r.durability,
        });
      }
    }
  };
  // const onChangeLevel = ()

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
          >
            <Form.Item label="等级">
              <InputNumber
                min={1}
                max={80}
                value={attributes.level}
                onChange={(level) =>
                  onChangeAttributes({ ...attributes, level })
                }
              />
            </Form.Item>
            <Form.Item label="作业精度">
              <InputNumber
                min={1}
                value={attributes.craftsmanship}
                onChange={(craftsmanship) =>
                  onChangeAttributes({ ...attributes, craftsmanship })
                }
              />
            </Form.Item>
            <Form.Item label="加工精度">
              <InputNumber
                min={1}
                value={attributes.control}
                onChange={(control) =>
                  onChangeAttributes({ ...attributes, control })
                }
              />
            </Form.Item>
            <Form.Item label="制作力">
              <InputNumber
                min={1}
                value={attributes.craftPoint}
                onChange={(craftPoint) =>
                  onChangeAttributes({ ...attributes, craftPoint })
                }
              />
            </Form.Item>
          </Form>
        </Col>
        <Col span={12}>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
          >
            <Form.Item label="预设配方">
              <Cascader
                options={data}
                defaultValue={recipePath}
                onChange={onRecipeChange}
                placeholder="请选择"
                showSearch={{ filter }}
              />
            </Form.Item>
            <Form.Item label="配方品级">
              <InputNumber
                value={recipe.recipeLevel}
                onChange={(recipeLevel) =>
                  onChangeRecipe({ ...recipe, recipeLevel })
                }
                disabled={recipePath[0] !== 'custom'}
              />
            </Form.Item>
            <Form.Item label="最大进展">
              <InputNumber
                value={recipe.progress}
                onChange={(progress) => onChangeRecipe({ ...recipe, progress })}
                disabled={recipePath[0] !== 'custom'}
              />
            </Form.Item>
            <Form.Item label="最高品质">
              <InputNumber
                value={recipe.quality}
                onChange={(quality) => onChangeRecipe({ ...recipe, quality })}
                disabled={recipePath[0] !== 'custom'}
              />
            </Form.Item>
            <Form.Item label="基础等级">
              <InputNumber
                value={recipe.baseLevel}
                onChange={(baseLevel) =>
                  onChangeRecipe({ ...recipe, baseLevel })
                }
                disabled={recipePath[0] !== 'custom'}
              />
            </Form.Item>
            <Form.Item label="配方耐久">
              <InputNumber
                value={recipe.durability}
                onChange={(durability) =>
                  onChangeRecipe({ ...recipe, durability })
                }
                disabled={recipePath[0] !== 'custom'}
              />
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <Button type="primary" onClick={onNextPage}>
        下一步
      </Button>
    </div>
  );
}
