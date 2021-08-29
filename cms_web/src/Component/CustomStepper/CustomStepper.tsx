import Step from "@material-ui/core/Step";
import StepConnector from "@material-ui/core/StepConnector";
import { StepIconProps } from "@material-ui/core/StepIcon";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from "@material-ui/core/styles";
import Check from "@material-ui/icons/Check";
import clsx from "clsx";
import React from "react";

const QontoConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  active: {
    "& $line": {
      borderColor: "#784af4",
    },
  },
  completed: {
    "& $line": {
      borderColor: "#784af4",
    },
  },
  line: {
    borderColor: "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
  root: {
    color: "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
  },
  active: {
    color: "#784af4",
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  completed: {
    color: "#784af4",
    zIndex: 1,
    // fontSize: 18,
  },
});

function QontoStepIcon(props: StepIconProps) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? (
        <Check className={classes.completed} />
      ) : (
        <div className={classes.circle} />
      )}
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    button: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
);

export interface StepsProps {
  label: string;
  subtitle?: string;
  View: any;
}

interface CustomStepperProps {
  steps: Array<StepsProps>;
  active_step: number;
}

const CustomStepper: React.FC<CustomStepperProps> = ({
  steps,
  active_step,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Stepper
        alternativeLabel
        activeStep={active_step}
        connector={<QontoConnector />}
      >
        {steps?.map((step, key) => (
          <Step key={key}>
            <StepLabel StepIconComponent={QontoStepIcon}>
              <div style={{ fontWeight: 600, fontSize: `1em` }}>
                {step.label}
              </div>
              {!!step.subtitle && (
                <div>
                  <small
                    style={{
                      fontSize: `.67em`,
                      fontWeight: 400,
                      opacity: 1,
                    }}
                  >
                    {step.subtitle}
                  </small>
                </div>
              )}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <div style={{ display: `grid`, gridTemplateAreas: `s` }}>
        {steps.map((step, index) => (
          <div
            key={index}
            style={{
              gridArea: `s`,
              opacity: active_step === index ? 1 : 0,
              zIndex: active_step === index ? 1 : 0,
              maxHeight: active_step === index ? `100%` : 0,
              // transition: `.1s opacity ease-in`,
            }}
          >
            {step.View}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomStepper;
