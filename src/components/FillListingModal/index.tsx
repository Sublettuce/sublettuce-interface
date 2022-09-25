import {
  ActionIcon,
  Button,
  Card,
  Container,
  Group,
  Select,
  NumberInput,
  Text,
  TextInput,
  Title,
  Switch,
  SegmentedControl,
  Box,
  Divider,
  LoadingOverlay,
  Loader,
} from "@mantine/core";
import { openModal, closeAllModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons";
import { BigNumber, ethers } from "ethers";
import { useAccount, useSignMessage } from "wagmi";
import { useRef, useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, getDocs, DocumentData } from "firebase/firestore";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

import tokens from "../../constants/tokens.json";
import { SUBLET_ADDRESS, INFINITE_DURATION } from "../../constants";

interface FormValues {
  subLabel: string;
  intervalCount: number;
}

export default function ModalForm({ doc }: { doc: DocumentData }) {
  return <>{doc.name}</>;
}
