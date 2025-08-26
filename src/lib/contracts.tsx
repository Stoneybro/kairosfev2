import { cookies } from "next/headers";

export const SMART_ACCOUNT_ABI = [
  {
    type: "fallback",
    stateMutability: "payable",
  },
  {
    type: "receive",
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "cancelTask",
    inputs: [
      {
        name: "taskId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "completeTask",
    inputs: [
      {
        name: "taskId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createTask",
    inputs: [
      {
        name: "description",
        type: "string",
        internalType: "string",
      },
      {
        name: "rewardAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "deadlineInSeconds",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "choice",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "buddy",
        type: "address",
        internalType: "address",
      },
      {
        name: "delayDuration",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "execute",
    inputs: [
      {
        name: "dest",
        type: "address",
        internalType: "address",
      },
      {
        name: "value",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "functionData",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "expiredTaskCallback",
    inputs: [
      {
        name: "taskId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getAllTasks",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct ITaskManager.Task[]",
        components: [
          {
            name: "id",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "description",
            type: "string",
            internalType: "string",
          },
          {
            name: "rewardAmount",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "deadline",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "valid",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "status",
            type: "uint8",
            internalType: "enum ITaskManager.TaskStatus",
          },
          {
            name: "choice",
            type: "uint8",
            internalType: "uint8",
          },
          {
            name: "delayDuration",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "buddy",
            type: "address",
            internalType: "address",
          },
          {
            name: "delayedRewardReleased",
            type: "bool",
            internalType: "bool",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTask",
    inputs: [
      {
        name: "taskId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct ITaskManager.Task",
        components: [
          {
            name: "id",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "description",
            type: "string",
            internalType: "string",
          },
          {
            name: "rewardAmount",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "deadline",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "valid",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "status",
            type: "uint8",
            internalType: "enum ITaskManager.TaskStatus",
          },
          {
            name: "choice",
            type: "uint8",
            internalType: "uint8",
          },
          {
            name: "delayDuration",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "buddy",
            type: "address",
            internalType: "address",
          },
          {
            name: "delayedRewardReleased",
            type: "bool",
            internalType: "bool",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTotalTasks",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initialize",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
      {
        name: "entryPoint",
        type: "address",
        internalType: "address",
      },
      {
        name: "_taskManager",
        type: "address",
        internalType: "contract ITaskManager",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "releaseDelayedPayment",
    inputs: [
      {
        name: "taskId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "s_owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "s_totalCommittedReward",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "supportsInterface",
    inputs: [
      {
        name: "interfaceId",
        type: "bytes4",
        internalType: "bytes4",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "taskManager",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract ITaskManager",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transfer",
    inputs: [
      {
        name: "destination",
        type: "address",
        internalType: "address",
      },
      {
        name: "value",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "validateUserOp",
    inputs: [
      {
        name: "userOp",
        type: "tuple",
        internalType: "struct UserOperation",
        components: [
          {
            name: "sender",
            type: "address",
            internalType: "address",
          },
          {
            name: "nonce",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "initCode",
            type: "bytes",
            internalType: "bytes",
          },
          {
            name: "callData",
            type: "bytes",
            internalType: "bytes",
          },
          {
            name: "callGasLimit",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "verificationGasLimit",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "preVerificationGas",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "maxFeePerGas",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "maxPriorityFeePerGas",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "paymasterAndData",
            type: "bytes",
            internalType: "bytes",
          },
          {
            name: "signature",
            type: "bytes",
            internalType: "bytes",
          },
        ],
      },
      {
        name: "userOpHash",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "missingAccountFunds",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "validationData",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "DelayedPaymentReleased",
    inputs: [
      {
        name: "taskId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "rewardAmount",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DurationPenaltyApplied",
    inputs: [
      {
        name: "taskId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "penaltyDuration",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Initialized",
    inputs: [
      {
        name: "version",
        type: "uint64",
        indexed: false,
        internalType: "uint64",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PenaltyFundsReleasedToBuddy",
    inputs: [
      {
        name: "taskId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "rewardAmount",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "buddy",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TaskCanceled",
    inputs: [
      {
        name: "taskId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TaskCompleted",
    inputs: [
      {
        name: "taskId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TaskCreated",
    inputs: [
      {
        name: "taskId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "description",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "rewardAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TaskExpired",
    inputs: [
      {
        name: "taskId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Transferred",
    inputs: [
      {
        name: "to",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "ECDSAInvalidSignature",
    inputs: [],
  },
  {
    type: "error",
    name: "ECDSAInvalidSignatureLength",
    inputs: [
      {
        name: "length",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "ECDSAInvalidSignatureS",
    inputs: [
      {
        name: "s",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
  },
  {
    type: "error",
    name: "InvalidInitialization",
    inputs: [],
  },
  {
    type: "error",
    name: "NotInitializing",
    inputs: [],
  },
  {
    type: "error",
    name: "ReentrancyGuardReentrantCall",
    inputs: [],
  },
  {
    type: "error",
    name: "SmartAccount__AddMoreFunds",
    inputs: [],
  },
  {
    type: "error",
    name: "SmartAccount__CannotTransferZero",
    inputs: [],
  },
  {
    type: "error",
    name: "SmartAccount__CannotWithdrawCommittedRewards",
    inputs: [],
  },
  {
    type: "error",
    name: "SmartAccount__ExecutionFailed",
    inputs: [
      {
        name: "result",
        type: "bytes",
        internalType: "bytes",
      },
    ],
  },
  {
    type: "error",
    name: "SmartAccount__InsufficientCommittedReward",
    inputs: [],
  },
  {
    type: "error",
    name: "SmartAccount__InvalidPenaltyChoice",
    inputs: [],
  },
  {
    type: "error",
    name: "SmartAccount__InvalidPenaltyConfig",
    inputs: [],
  },
  {
    type: "error",
    name: "SmartAccount__NoTaskManagerLinked",
    inputs: [],
  },
  {
    type: "error",
    name: "SmartAccount__NotFromEntryPoint",
    inputs: [],
  },
  {
    type: "error",
    name: "SmartAccount__OnlyOwnerCanCall",
    inputs: [],
  },
  {
    type: "error",
    name: "SmartAccount__OnlyTaskManagerCanCall",
    inputs: [],
  },
  {
    type: "error",
    name: "SmartAccount__PayPrefundFailed",
    inputs: [],
  },
  {
    type: "error",
    name: "SmartAccount__PaymentAlreadyReleased",
    inputs: [],
  },
  {
    type: "error",
    name: "SmartAccount__PenaltyDurationNotElapsed",
    inputs: [],
  },
  {
    type: "error",
    name: "SmartAccount__PenaltyTypeMismatch",
    inputs: [],
  },
  {
    type: "error",
    name: "SmartAccount__PickAPenalty",
    inputs: [],
  },
  {
    type: "error",
    name: "SmartAccount__RewardCannotBeZero",
    inputs: [],
  },
  {
    type: "error",
    name: "SmartAccount__TaskAlreadyCanceled",
    inputs: [],
  },
  {
    type: "error",
    name: "SmartAccount__TaskAlreadyCompleted",
    inputs: [],
  },
  {
    type: "error",
    name: "SmartAccount__TaskNotExpired",
    inputs: [],
  },
  {
    type: "error",
    name: "SmartAccount__TaskRewardPaymentFailed",
    inputs: [],
  },
  {
    type: "error",
    name: "SmartAccount__TransferFailed",
    inputs: [],
  },
] as const;

export const ACCOUNT_FACTORY_ABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "entryPoint",
        type: "address",
        internalType: "address",
      },
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
      {
        name: "taskManager",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createAccount",
    inputs: [
      {
        name: "userNonce",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getAddress",
    inputs: [
      {
        name: "userNonce",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "predictedAddress",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAddressForUser",
    inputs: [
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
      {
        name: "userNonce",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "predictedAddress",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getEntryPoint",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getImplementation",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTaskManager",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUserClone",
    inputs: [
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "implementation",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "s_owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "userClones",
    inputs: [
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "clone",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "CloneCreated",
    inputs: [
      {
        name: "clone",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "salt",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "AccountFactory__ContractAlreadyDeployed",
    inputs: [],
  },
  {
    type: "error",
    name: "AccountFactory__InitializationFailed",
    inputs: [],
  },
  {
    type: "error",
    name: "AccountFactory__InvalidEntryPoint",
    inputs: [],
  },
  {
    type: "error",
    name: "AccountFactory__InvalidOwner",
    inputs: [],
  },
  {
    type: "error",
    name: "AccountFactory__InvalidTaskManager",
    inputs: [],
  },
  {
    type: "error",
    name: "ERC1167FailedCreateClone",
    inputs: [],
  },
] as const;

export const ENTRYPOINT_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "preOpGas", type: "uint256" },
      { internalType: "uint256", name: "paid", type: "uint256" },
      { internalType: "uint48", name: "validAfter", type: "uint48" },
      { internalType: "uint48", name: "validUntil", type: "uint48" },
      { internalType: "bool", name: "targetSuccess", type: "bool" },
      { internalType: "bytes", name: "targetResult", type: "bytes" },
    ],
    name: "ExecutionResult",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "opIndex", type: "uint256" },
      { internalType: "string", name: "reason", type: "string" },
    ],
    name: "FailedOp",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "sender", type: "address" }],
    name: "SenderAddressResult",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "aggregator", type: "address" }],
    name: "SignatureValidationFailed",
    type: "error",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "preOpGas", type: "uint256" },
          { internalType: "uint256", name: "prefund", type: "uint256" },
          { internalType: "bool", name: "sigFailed", type: "bool" },
          { internalType: "uint48", name: "validAfter", type: "uint48" },
          { internalType: "uint48", name: "validUntil", type: "uint48" },
          { internalType: "bytes", name: "paymasterContext", type: "bytes" },
        ],
        internalType: "struct IEntryPoint.ReturnInfo",
        name: "returnInfo",
        type: "tuple",
      },
      {
        components: [
          { internalType: "uint256", name: "stake", type: "uint256" },
          { internalType: "uint256", name: "unstakeDelaySec", type: "uint256" },
        ],
        internalType: "struct IStakeManager.StakeInfo",
        name: "senderInfo",
        type: "tuple",
      },
      {
        components: [
          { internalType: "uint256", name: "stake", type: "uint256" },
          { internalType: "uint256", name: "unstakeDelaySec", type: "uint256" },
        ],
        internalType: "struct IStakeManager.StakeInfo",
        name: "factoryInfo",
        type: "tuple",
      },
      {
        components: [
          { internalType: "uint256", name: "stake", type: "uint256" },
          { internalType: "uint256", name: "unstakeDelaySec", type: "uint256" },
        ],
        internalType: "struct IStakeManager.StakeInfo",
        name: "paymasterInfo",
        type: "tuple",
      },
    ],
    name: "ValidationResult",
    type: "error",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "preOpGas", type: "uint256" },
          { internalType: "uint256", name: "prefund", type: "uint256" },
          { internalType: "bool", name: "sigFailed", type: "bool" },
          { internalType: "uint48", name: "validAfter", type: "uint48" },
          { internalType: "uint48", name: "validUntil", type: "uint48" },
          { internalType: "bytes", name: "paymasterContext", type: "bytes" },
        ],
        internalType: "struct IEntryPoint.ReturnInfo",
        name: "returnInfo",
        type: "tuple",
      },
      {
        components: [
          { internalType: "uint256", name: "stake", type: "uint256" },
          { internalType: "uint256", name: "unstakeDelaySec", type: "uint256" },
        ],
        internalType: "struct IStakeManager.StakeInfo",
        name: "senderInfo",
        type: "tuple",
      },
      {
        components: [
          { internalType: "uint256", name: "stake", type: "uint256" },
          { internalType: "uint256", name: "unstakeDelaySec", type: "uint256" },
        ],
        internalType: "struct IStakeManager.StakeInfo",
        name: "factoryInfo",
        type: "tuple",
      },
      {
        components: [
          { internalType: "uint256", name: "stake", type: "uint256" },
          { internalType: "uint256", name: "unstakeDelaySec", type: "uint256" },
        ],
        internalType: "struct IStakeManager.StakeInfo",
        name: "paymasterInfo",
        type: "tuple",
      },
      {
        components: [
          { internalType: "address", name: "aggregator", type: "address" },
          {
            components: [
              { internalType: "uint256", name: "stake", type: "uint256" },
              {
                internalType: "uint256",
                name: "unstakeDelaySec",
                type: "uint256",
              },
            ],
            internalType: "struct IStakeManager.StakeInfo",
            name: "stakeInfo",
            type: "tuple",
          },
        ],
        internalType: "struct IEntryPoint.AggregatorStakeInfo",
        name: "aggregatorInfo",
        type: "tuple",
      },
    ],
    name: "ValidationResultWithAggregation",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "userOpHash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "factory",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "paymaster",
        type: "address",
      },
    ],
    name: "AccountDeployed",
    type: "event",
  },
  { anonymous: false, inputs: [], name: "BeforeExecution", type: "event" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalDeposit",
        type: "uint256",
      },
    ],
    name: "Deposited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "aggregator",
        type: "address",
      },
    ],
    name: "SignatureAggregatorChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalStaked",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "unstakeDelaySec",
        type: "uint256",
      },
    ],
    name: "StakeLocked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "withdrawTime",
        type: "uint256",
      },
    ],
    name: "StakeUnlocked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "withdrawAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "StakeWithdrawn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "userOpHash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "paymaster",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
      { indexed: false, internalType: "bool", name: "success", type: "bool" },
      {
        indexed: false,
        internalType: "uint256",
        name: "actualGasCost",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "actualGasUsed",
        type: "uint256",
      },
    ],
    name: "UserOperationEvent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "userOpHash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "revertReason",
        type: "bytes",
      },
    ],
    name: "UserOperationRevertReason",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "withdrawAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdrawn",
    type: "event",
  },
  {
    inputs: [],
    name: "SIG_VALIDATION_FAILED",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes", name: "initCode", type: "bytes" },
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "bytes", name: "paymasterAndData", type: "bytes" },
    ],
    name: "_validateSenderAndPaymaster",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint32", name: "unstakeDelaySec", type: "uint32" },
    ],
    name: "addStake",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "depositTo",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "deposits",
    outputs: [
      { internalType: "uint112", name: "deposit", type: "uint112" },
      { internalType: "bool", name: "staked", type: "bool" },
      { internalType: "uint112", name: "stake", type: "uint112" },
      { internalType: "uint32", name: "unstakeDelaySec", type: "uint32" },
      { internalType: "uint48", name: "withdrawTime", type: "uint48" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "getDepositInfo",
    outputs: [
      {
        components: [
          { internalType: "uint112", name: "deposit", type: "uint112" },
          { internalType: "bool", name: "staked", type: "bool" },
          { internalType: "uint112", name: "stake", type: "uint112" },
          { internalType: "uint32", name: "unstakeDelaySec", type: "uint32" },
          { internalType: "uint48", name: "withdrawTime", type: "uint48" },
        ],
        internalType: "struct IStakeManager.DepositInfo",
        name: "info",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "uint192", name: "key", type: "uint192" },
    ],
    name: "getNonce",
    outputs: [{ internalType: "uint256", name: "nonce", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes", name: "initCode", type: "bytes" }],
    name: "getSenderAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "sender", type: "address" },
          { internalType: "uint256", name: "nonce", type: "uint256" },
          { internalType: "bytes", name: "initCode", type: "bytes" },
          { internalType: "bytes", name: "callData", type: "bytes" },
          { internalType: "uint256", name: "callGasLimit", type: "uint256" },
          {
            internalType: "uint256",
            name: "verificationGasLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "preVerificationGas",
            type: "uint256",
          },
          { internalType: "uint256", name: "maxFeePerGas", type: "uint256" },
          {
            internalType: "uint256",
            name: "maxPriorityFeePerGas",
            type: "uint256",
          },
          { internalType: "bytes", name: "paymasterAndData", type: "bytes" },
          { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        internalType: "struct UserOperation",
        name: "userOp",
        type: "tuple",
      },
    ],
    name: "getUserOpHash",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { internalType: "address", name: "sender", type: "address" },
              { internalType: "uint256", name: "nonce", type: "uint256" },
              { internalType: "bytes", name: "initCode", type: "bytes" },
              { internalType: "bytes", name: "callData", type: "bytes" },
              {
                internalType: "uint256",
                name: "callGasLimit",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "verificationGasLimit",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "preVerificationGas",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "maxFeePerGas",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "maxPriorityFeePerGas",
                type: "uint256",
              },
              {
                internalType: "bytes",
                name: "paymasterAndData",
                type: "bytes",
              },
              { internalType: "bytes", name: "signature", type: "bytes" },
            ],
            internalType: "struct UserOperation[]",
            name: "userOps",
            type: "tuple[]",
          },
          {
            internalType: "contract IAggregator",
            name: "aggregator",
            type: "address",
          },
          { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        internalType: "struct IEntryPoint.UserOpsPerAggregator[]",
        name: "opsPerAggregator",
        type: "tuple[]",
      },
      { internalType: "address payable", name: "beneficiary", type: "address" },
    ],
    name: "handleAggregatedOps",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "sender", type: "address" },
          { internalType: "uint256", name: "nonce", type: "uint256" },
          { internalType: "bytes", name: "initCode", type: "bytes" },
          { internalType: "bytes", name: "callData", type: "bytes" },
          { internalType: "uint256", name: "callGasLimit", type: "uint256" },
          {
            internalType: "uint256",
            name: "verificationGasLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "preVerificationGas",
            type: "uint256",
          },
          { internalType: "uint256", name: "maxFeePerGas", type: "uint256" },
          {
            internalType: "uint256",
            name: "maxPriorityFeePerGas",
            type: "uint256",
          },
          { internalType: "bytes", name: "paymasterAndData", type: "bytes" },
          { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        internalType: "struct UserOperation[]",
        name: "ops",
        type: "tuple[]",
      },
      { internalType: "address payable", name: "beneficiary", type: "address" },
    ],
    name: "handleOps",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint192", name: "key", type: "uint192" }],
    name: "incrementNonce",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes", name: "callData", type: "bytes" },
      {
        components: [
          {
            components: [
              { internalType: "address", name: "sender", type: "address" },
              { internalType: "uint256", name: "nonce", type: "uint256" },
              {
                internalType: "uint256",
                name: "callGasLimit",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "verificationGasLimit",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "preVerificationGas",
                type: "uint256",
              },
              { internalType: "address", name: "paymaster", type: "address" },
              {
                internalType: "uint256",
                name: "maxFeePerGas",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "maxPriorityFeePerGas",
                type: "uint256",
              },
            ],
            internalType: "struct EntryPoint.MemoryUserOp",
            name: "mUserOp",
            type: "tuple",
          },
          { internalType: "bytes32", name: "userOpHash", type: "bytes32" },
          { internalType: "uint256", name: "prefund", type: "uint256" },
          { internalType: "uint256", name: "contextOffset", type: "uint256" },
          { internalType: "uint256", name: "preOpGas", type: "uint256" },
        ],
        internalType: "struct EntryPoint.UserOpInfo",
        name: "opInfo",
        type: "tuple",
      },
      { internalType: "bytes", name: "context", type: "bytes" },
    ],
    name: "innerHandleOp",
    outputs: [
      { internalType: "uint256", name: "actualGasCost", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint192", name: "", type: "uint192" },
    ],
    name: "nonceSequenceNumber",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "sender", type: "address" },
          { internalType: "uint256", name: "nonce", type: "uint256" },
          { internalType: "bytes", name: "initCode", type: "bytes" },
          { internalType: "bytes", name: "callData", type: "bytes" },
          { internalType: "uint256", name: "callGasLimit", type: "uint256" },
          {
            internalType: "uint256",
            name: "verificationGasLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "preVerificationGas",
            type: "uint256",
          },
          { internalType: "uint256", name: "maxFeePerGas", type: "uint256" },
          {
            internalType: "uint256",
            name: "maxPriorityFeePerGas",
            type: "uint256",
          },
          { internalType: "bytes", name: "paymasterAndData", type: "bytes" },
          { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        internalType: "struct UserOperation",
        name: "op",
        type: "tuple",
      },
      { internalType: "address", name: "target", type: "address" },
      { internalType: "bytes", name: "targetCallData", type: "bytes" },
    ],
    name: "simulateHandleOp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "sender", type: "address" },
          { internalType: "uint256", name: "nonce", type: "uint256" },
          { internalType: "bytes", name: "initCode", type: "bytes" },
          { internalType: "bytes", name: "callData", type: "bytes" },
          { internalType: "uint256", name: "callGasLimit", type: "uint256" },
          {
            internalType: "uint256",
            name: "verificationGasLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "preVerificationGas",
            type: "uint256",
          },
          { internalType: "uint256", name: "maxFeePerGas", type: "uint256" },
          {
            internalType: "uint256",
            name: "maxPriorityFeePerGas",
            type: "uint256",
          },
          { internalType: "bytes", name: "paymasterAndData", type: "bytes" },
          { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        internalType: "struct UserOperation",
        name: "userOp",
        type: "tuple",
      },
    ],
    name: "simulateValidation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unlockStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "withdrawAddress",
        type: "address",
      },
    ],
    name: "withdrawStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "withdrawAddress",
        type: "address",
      },
      { internalType: "uint256", name: "withdrawAmount", type: "uint256" },
    ],
    name: "withdrawTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
] as const;

export const CONTRACT_ADDRESSES = {
  ACCOUNT_FACTORY:
    "0x5D16F29E70e90ac48C7F4fb2c1145911a774eFbF" as `0x${string}`, //base sepolia
};

