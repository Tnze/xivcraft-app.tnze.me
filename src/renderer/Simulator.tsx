import React from 'react';
import { Row, Col, Progress } from 'antd';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { DualAxes } from '@ant-design/charts';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Status } from 'xiv-solver';
import { DualAxesOptions } from '@antv/g2plot/lib/plots/dual-axes/types';
import SkillIcon from './SkillIcon';

const skillList = [
  'muscle_memory',
  'reflect',
  'trained_eye',
  'basic_synth',
  'brand_of_the_elements',
  'careful_synth',
  'focused_synth',
  'groundwork',
  'intensive_synth',
  'delicate_synth',
  'basic_touch',
  'standard_touch',
  'byregot_s_blessing',
  'precise_touch',
  'prudent_touch',
  'focused_touch',
  'preparatory_touch',
  'masters_mend',
  'waste_not',
  'waste_not_ii',
  'manipulation',
  'inner_quiet',
  'veneration',
  'innovation',
  'great_strides',
  'name_of_the_elements',
  'observe',
  'final_appraisal',
];

const skillsNameTranslate = new Map([
  ['basic_synth', '制作'],
  ['basic_touch', '加工'],
  ['masters_mend', '精修'],
  ['inner_quiet', '内静'],
  ['observe', '观察'],
  ['tricks_of_the_trade', '秘诀'],
  ['waste_not', '俭约'],
  ['veneration', '崇敬'],
  ['standard_touch', '中级加工'],
  ['great_strides', '阔步'],
  ['innovation', '改革'],
  ['name_of_the_elements', '元素之美名'],
  ['brand_of_the_elements', '元素之印记'],
  ['final_appraisal', '最终确认'],
  ['waste_not_ii', '长期俭约'],
  ['byregot_s_blessing', '比尔格的祝福'],
  ['precise_touch', '集中加工'],
  ['muscle_memory', '坚信'],
  ['careful_synth', '模范制作'],
  ['manipulation', '掌握'],
  ['prudent_touch', '俭约加工'],
  ['focused_synth', '注视制作'],
  ['focused_touch', '注视加工'],
  ['reflect', '闲静'],
  ['preparatory_touch', '坯料加工'],
  ['groundwork', '坯料制作'],
  ['delicate_synth', '精密制作'],
  ['intensive_synth', '集中制作'],
  ['trained_eye', '工匠的神速技巧'],
]);

interface ISkillsButtonListProps {
  appendSkill: (arg0: string) => void;
}

const SkillsButtonList = ({ appendSkill }: ISkillsButtonListProps) => (
  <Row>
    {skillList.map((sk, i) => {
      const key = `[${i}] ${sk}`;
      return (
        <Col key={key} flex="48px">
          <button
            type="button"
            onClick={() => appendSkill(sk)}
            style={{
              margin: 0,
              padding: 0,
              outline: 'none',
              border: 'none',
            }}
          >
            <SkillIcon skill={sk} />
          </button>
        </Col>
      );
    })}
  </Row>
);
export interface Attributes {
  level: number;
  craftsmanship: number;
  control: number;
  craftPoint: number;
}

export interface Recipe {
  recipeLevel: number;
  baseLevel: number;
  progress: number;
  quality: number;
  durability: number;
}

interface ISimulatorProps {
  attributes: Attributes;
  recipe: Recipe;
  setHelperLoading: (persent: number) => void;
}

export default function Simulator({ attributes, recipe }: ISimulatorProps) {
  const [userSkills, setUserSkills] = React.useState<string[]>([]);
  const [autoSkills] = React.useState<string[]>([]);
  const [simulateResult, setSimulateResult] = React.useState<any[]>([[], []]);
  const [du, setDu] = React.useState(recipe.durability);
  const [cp, setCp] = React.useState(attributes.craftPoint);
  const [pg, setPg] = React.useState(0);
  const [qu, setQu] = React.useState(0);

  const simulate = (skills: string[]) => {
    const s = new Status(
      attributes.level,
      attributes.craftsmanship,
      attributes.control,
      attributes.craftPoint,
      false,
      recipe.recipeLevel,
      recipe.baseLevel,
      recipe.progress,
      recipe.quality,
      recipe.durability
    );
    const resources: { skill: string; value: number; key: string }[] = [];
    const incomes: { skill: string; value: number; key: string }[] = [];
    const errors = [];

    skills.forEach((sk, i) => {
      const skillID = `[${Number(i) + 1}] ${skillsNameTranslate.get(sk)}`;
      try {
        s.castSkill(skills[i]);
        const status = s.readProperties();
        resources.push({
          skill: skillID,
          value: status.durability,
          key: 'durability',
        });
        resources.push({
          skill: skillID,
          value: status.craft_points,
          key: 'craft_points',
        });
        incomes.push({
          skill: skillID,
          value: status.progress,
          key: 'progress',
        });
        incomes.push({
          skill: skillID,
          value: status.quality,
          key: 'quality',
        });
      } catch (e) {
        errors.push({ skill: skillID, err: e });
      }
    });
    const status = s.readProperties();
    setSimulateResult([resources, incomes]);
    setDu(status.durability);
    setCp(status.craft_points);
    setPg(status.progress);
    setQu(status.quality);
  };

  const onItemsChange = (skills: string[]) => {
    simulate(skills);
    // this.state.worker.postMessage({
    //     action: 'resolve',
    //     pre: skills,
    // })
  };

  const grid = 8;
  const config: DualAxesOptions = {
    data: simulateResult,
    xField: 'skill',
    yField: ['value', 'value'],
    geometryOptions: [
      {
        geometry: 'column',
        isStack: true,
        seriesField: 'key',
      },
      {
        geometry: 'line',
        seriesField: 'key',
        stepType: 'hvh',
      },
    ],
    xAxis: {
      label: {
        autoRotate: true,
        autoHide: false,
        autoEllipsis: false,
      },
    },
    annotations: {
      value: [
        {
          type: 'line',
          top: true,
          start: ['min', recipe.progress],
          end: ['max', recipe.progress],
          style: {
            lineWidth: 1,
            lineDash: [3, 3],
          },
          text: {
            content: `完成进展阈值(${recipe.progress})`,
            position: 'end',
            style: { textAlign: 'end' },
          },
        },
        {
          type: 'line',
          top: true,
          start: ['min', recipe.quality],
          end: ['max', recipe.quality],
          style: {
            lineWidth: 1,
            lineDash: [3, 3],
          },
          text: {
            content: `最高品质(${recipe.quality})`,
            position: 'end',
            style: { textAlign: 'end' },
          },
        },
      ],
    },
  };

  const onDelete = (i: number) => {
    const newItems = Array.from(userSkills);
    newItems.splice(i, 1);
    setUserSkills(newItems);
    onItemsChange(newItems);
  };
  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (result.destination) {
      // reorder
      const newUserSkills = Array.from(userSkills);
      const [removed] = newUserSkills.splice(result.source.index, 1);
      newUserSkills.splice(result.destination.index, 0, removed);

      setUserSkills(newUserSkills);
      onItemsChange(newUserSkills);
    }
  };
  const appendSkill = (sk: string) => {
    const result = Array.from(userSkills);
    result.push(sk);
    setUserSkills(result);
    onItemsChange(result);
  };
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
              {(provided_drop, _snapshot_drop) => (
                <div
                  ref={provided_drop.innerRef}
                  style={{
                    background: 'transparent',
                    display: 'flex',
                    padding: grid,
                    overflow: 'auto',
                  }}
                  {...provided_drop.droppableProps}
                >
                  {userSkills.map((item, index) => {
                    const key = `[${index}]${item}`;
                    return (
                      <Draggable
                        key={key}
                        draggableId={`[${index}]${item}`}
                        index={index}
                      >
                        {(provided, _snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              // some basic styles to make the items look a bit nicer
                              userSelect: 'none',

                              // change background colour if dragging
                              background: 'transparent',

                              // styles we need to apply on draggables
                              ...provided.draggableProps.style,
                            }}
                            onContextMenu={(e) => {
                              onDelete(index);
                              e.preventDefault();
                            }}
                          >
                            <SkillIcon skill={item} />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided_drop.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Col>
      </Row>
      <Row style={{ padding: '8px' }} gutter={[16, 16]}>
        {autoSkills.map((item, i) => {
          const key = `[${i}] ${item}`;
          return (
            <Col style={{ padding: 0 }} key={key} flex="48px">
              <SkillIcon skill={item} />
            </Col>
          );
        })}
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Row>
            <Col flex={1}>
              <Progress
                type="circle"
                percent={(pg / recipe.progress) * 100}
                format={(_percent) => pg.toString()}
                width={80}
              />
            </Col>
            <Col flex={1}>
              <Progress
                type="circle"
                percent={(qu / recipe.quality) * 100}
                format={(_percent) => qu.toString()}
                width={80}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col flex={2}>
              <Progress
                percent={(du / recipe.durability) * 100}
                steps={7}
                format={(_percent) => `${du} Du`}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col flex={22}>
              <Progress
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                percent={(cp / attributes.craftPoint) * 100}
                format={(_percent) => `${cp} CP`}
              />
            </Col>
          </Row>
          <SkillsButtonList appendSkill={appendSkill} />
        </Col>
        <Col span={16}>
          <DualAxes {...config} />
        </Col>
      </Row>
    </div>
  );
}